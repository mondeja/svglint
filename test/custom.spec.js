/**
 * @fileoverview Tests for the `custom` rules.
 */

import {testFailsFactory, testSucceedsFactory} from './helpers.js';

const testSVG = `<svg role="img" viewBox="0 0 24 24">
    <g id="foo">
        <path d="bar"></path>
    </g>
    <g></g>
    <circle></circle>
</svg>`;

const testFails = testFailsFactory(testSVG, 'custom');
const testSucceeds = testSucceedsFactory(testSVG, 'custom');

describe('Rule: custom', function () {
    it('should succeed without config', function () {
        return testSucceeds([]);
    });

    it('should provide file information', function () {
        return testSucceeds([
            (reporter, _$, _ast, info) => {
                if (!info) {
                    reporter.error('no info provided');
                }

                // NOTE: Object.hasOwn is not available at Node.js v12 nor v14
                // eslint-disable-next-line prefer-object-has-own
                if (!Object.prototype.hasOwnProperty.call(info, 'filepath')) {
                    reporter.error('no filepath provided on info');
                }
            },
        ]);
    });

    it('should succeed with a void function', function () {
        return testSucceeds([() => {}]);
    });
    it('should succeed with an async void function', function () {
        return testSucceeds([
            () =>
                new Promise((resolve) => {
                    setTimeout(() => resolve(), 250);
                }),
        ]);
    });
    it('should fail with an exception inside function', function () {
        return testFails([
            () => {
                throw new Error('Foo');
            },
        ]);
    });
    it('should fail with an erroring function', function () {
        return testFails([
            (reporter, $, ast) => {
                reporter.error('Fails', $.find('svg')[0], ast);
            },
        ]);
    });
    it('should fail with an async erroring function', function () {
        return testFails([
            (reporter, $, ast) =>
                new Promise((resolve) => {
                    setTimeout(() => {
                        reporter.error('Fails', $.find('svg')[0], ast);
                        resolve();
                    }, 250);
                }),
        ]);
    });
});
