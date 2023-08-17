"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defined = exports.panic = void 0;
/**
 * Helper for unrecoverable errors: Log an error message and inspectable value, and abort.
 *
 * @throws Error with `message`
 */
var panic = function (message, value) {
    console.error(message, value);
    throw new Error(message);
};
exports.panic = panic;
/**
 * Return defined value or panic.
 */
var defined = function (value, message) {
    if (value !== undefined) {
        return value;
    }
    else {
        throw (0, exports.panic)(message !== null && message !== void 0 ? message : 'unexpected undefined', value);
    }
};
exports.defined = defined;
