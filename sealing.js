"use strict";
/** [`SealedMessage`] sealing and unsealing. */
Object.defineProperty(exports, "__esModule", { value: true });
exports.unseal_msgpack_as = exports.seal_msgpack_as = exports.unseal_msgpack = exports.seal_msgpack = exports.unseal = exports.seal = void 0;
var msgpack_1 = require("./msgpack");
/** Seal message bytes from [`sender_crypto`] to [`receiver_public_key`]. */
var seal = function (message_bytes, receiver_public_key, sender_crypto) {
    var encrypted_message = sender_crypto.encrypt_message(message_bytes, receiver_public_key);
    return {
        ciphertext: encrypted_message.ciphertext,
        nonce: encrypted_message.nonce,
        sender_public_key: sender_crypto.public_key,
    };
};
exports.seal = seal;
/** Unseal message bytes to [`receiver_crypto`]. */
var unseal = function (sealed_message, receiver_crypto) {
    return receiver_crypto.decrypt_message(sealed_message.ciphertext, sealed_message.sender_public_key, sealed_message.nonce);
};
exports.unseal = unseal;
// TODO: Better type handling.
/** [`seal`] as MessagePack. */
var seal_msgpack = function (message, receiver_public_key, sender_crypto) {
    var message_bytes = (0, msgpack_1.to_msgpack)(message);
    var sealed_message = (0, exports.seal)(message_bytes, receiver_public_key, sender_crypto);
    return (0, msgpack_1.to_msgpack)(sealed_message);
};
exports.seal_msgpack = seal_msgpack;
/** [`unseal`] as MessagePack. */
var unseal_msgpack = function (sealed_message_bytes, receiver_crypto) {
    var sealed_message = (0, msgpack_1.from_msgpack_as)(sealed_message_bytes);
    var message_bytes = (0, exports.unseal)(sealed_message, receiver_crypto);
    if (message_bytes === null) {
        return null;
    }
    return (0, msgpack_1.from_msgpack)(message_bytes);
};
exports.unseal_msgpack = unseal_msgpack;
// FIXME: Placeholder casts
var seal_msgpack_as = function (message, receiver_public_key, sender_crypto) { return (0, exports.seal_msgpack)(message, receiver_public_key, sender_crypto); };
exports.seal_msgpack_as = seal_msgpack_as;
var unseal_msgpack_as = function (sealed_message_bytes, receiver_crypto) { return (0, exports.unseal_msgpack)(sealed_message_bytes, receiver_crypto); };
exports.unseal_msgpack_as = unseal_msgpack_as;
