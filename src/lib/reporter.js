/**
 * @fileoverview The object that rules use to report errors, warnings and messages.
 */
const EventEmitter = require("events").EventEmitter;
const Logger = require("./logger");

/**
 * @typedef {Object} Result
 * @property {String} message The message as a single string, suitable for human consumption
 * @property {String} [stacktrace] If Result is related to a node, a human-suitable string showing the related part of the file
 * @property {any[]} _message The original message, as given by the rule
 * @property {Node} [_node] If Result is related to a node, the related node
 * @property {AST} [_ast] If Result is related to a node, the related AST
 */

/**
 * Generates a Result from the arguments given to .error()/.warn()/.log().
 * Mostly involves formatting the message that should be shown when logged.
 * @param {any[]|any} message The message of the result, in console.log format
 * @param {Node} [node] If the error is related to a node, the related node
 * @param {AST} [ast] If the error is related to a node, the related AST
 * @returns {Result}
 */
function generateResult(message, node, ast) {
    const _message = message instanceof Array ? message : [message];
    return {
        message: "foo",
        _message,
        _node: node,
        _ast: ast,
    };
}

class Reporter extends EventEmitter {
    /**
     * @param {String} name The name of this reporter
     */
    constructor(name) {
        super();
        this.name = name;
        this.logger = Logger(`rprt:${this.name}`);
        /** @type {Error[]} */
        this.exceptions = [];
        /** @type {Result[]} */
        this.errors = [];
        /** @type {Result[]} */
        this.warns = [];
        /** @type {Result[]} */
        this.logs = [];
    }

    /**
     * Reports that an exception occured during rule processing.
     * This doesn't change the current linting result, but is important to show
     *   to users as it indicates that the linting result cannot be trusted.
     * @param {Error} e The exception that occured.
     */
    exception(e) {
        this.logger.debug("Exception reported:", e);
        this.emit("exception", e);
        this.exceptions.push(e);
    }

    /**
     * Reports that an error was found during linting.
     * @param {any[]|any} message The message of the result, in console.log format
     * @param {Node} [node] If the error is related to a node, the related node
     * @param {AST} [ast] If the error is related to a node, the AST of the file
     */
    error(message, node, ast) {
        this.logger.debug("Error reported:", JSON.stringify(message));
        const result = generateResult(message, node, ast);
        this.errors.push(result);
    }

    /**
     * Reports that a warning was found during linting.
     * @param {any[]|any} message The message of the result, in console.log format
     * @param {Node} [node] If the warning is related to a node, the related node
     * @param {AST} [ast] If the warning is related to a node, the AST of the file
     */
    warn(message, node, ast) {
        this.logger.debug("Warn reported:", JSON.stringify(message));
        const result = generateResult(message, node, ast);
        this.warns.push(result);
    }

    /**
     * Shows a message to the user.
     * @param {any[]|any} message The message of the result, in console.log format
     * @param {Node} [node] If the message is related to a node, the related node
     * @param {AST} [ast] If the message is related to a node, the AST of the file
     */
    log(message, node, ast) {
        this.logger.debug("Log reported:", JSON.stringify(message));
        const result = generateResult(message, node, ast);
        this.logs.push(result);
    }
}
module.exports = Reporter;