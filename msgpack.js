"use strict";
/** MessagePack helper functions. */
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64 = exports.to_msgpack_as = exports.from_msgpack_as = exports.to_msgpack = exports.from_msgpack = void 0;
var msgpack_1 = require("@msgpack/msgpack");
/// Enable for verbose from_msgpack / to_msgpack console debugging logs.
var LOG_DEBUG = false;
var encoder = new msgpack_1.Encoder();
var decoder = new msgpack_1.Decoder();
// TODO: Better type handling.
var from_msgpack = function (bytes) {
    var value = decoder.decode(bytes);
    log_debug('from_msgpack', { value: value, bytes: bytes });
    return value;
};
exports.from_msgpack = from_msgpack;
var to_msgpack = function (value) {
    var bytes = encoder.encode(value);
    log_debug('to_msgpack', { value: value, bytes: bytes });
    return bytes;
};
exports.to_msgpack = to_msgpack;
var log_debug = function (label, _a) {
    var value = _a.value, bytes = _a.bytes;
    if (LOG_DEBUG) {
        // eslint-disable-next-line no-console
        console.debug(label, {
            value: value,
            bytes: (0, exports.base64)(bytes),
        });
    }
};
// FIXME: Placeholder casts
var from_msgpack_as = function (bytes) { return (0, exports.from_msgpack)(bytes); };
exports.from_msgpack_as = from_msgpack_as;
var to_msgpack_as = function (value) { return encoder.encode(value); };
exports.to_msgpack_as = to_msgpack_as;
/// Debugging helper
var base64 = function (bytes) {
    return btoa(Array.from(bytes, function (c) { return String.fromCodePoint(c); }).join(''));
};
exports.base64 = base64;
