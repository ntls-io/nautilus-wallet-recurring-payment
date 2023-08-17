"use strict";
/**
 * Interface patterned after `SodaBoxCrypto` on the server, but implemented using TweetNaCl.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiffieHellman = exports.hashWhenTooLong = exports.TweetNaClCrypto = void 0;
var hkdf_1 = require("@stablelib/hkdf/lib/hkdf");
var sha256_1 = require("@stablelib/sha256/lib/sha256");
var keyagreement_1 = require("@stablelib/x25519/lib/keyagreement");
var nacl = require("tweetnacl");
var TweetNaClCrypto = exports.TweetNaClCrypto = /** @class */ (function () {
    function TweetNaClCrypto(keyPair) {
        var _this = this;
        this.keyPair = keyPair;
        this.decrypt_message = function (ciphertext, their_pk, nonce) {
            return nacl.box.open(ciphertext, nonce, their_pk, _this.secret_key);
        };
        this.encrypt_message = function (message, their_pk) {
            var nonce = nacl.randomBytes(nacl.box.nonceLength);
            var ciphertext = nacl.box(message, nonce, their_pk, _this.secret_key);
            return { ciphertext: ciphertext, nonce: nonce };
        };
    }
    Object.defineProperty(TweetNaClCrypto.prototype, "public_key", {
        get: function () {
            return this.keyPair.publicKey;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TweetNaClCrypto.prototype, "secret_key", {
        get: function () {
            return this.keyPair.secretKey;
        },
        enumerable: false,
        configurable: true
    });
    TweetNaClCrypto.new = function () { return new TweetNaClCrypto(nacl.box.keyPair()); };
    return TweetNaClCrypto;
}());
/**
 * Hash a byte string that is (strictly) longer than 32 bytes.
 */
var hashWhenTooLong = function (msg) {
    if (msg.length > 32) {
        var hasher = new sha256_1.SHA256();
        hasher.update(msg);
        return hasher.digest();
    }
    return msg;
};
exports.hashWhenTooLong = hashWhenTooLong;
var DiffieHellman = exports.DiffieHellman = /** @class */ (function () {
    function DiffieHellman(context, seed) {
        if (context === void 0) { context = new Uint8Array(0); }
        var _this = this;
        this.finished = false;
        this.hkdfSalt = new Uint8Array(0);
        this.x25519 = new keyagreement_1.X25519KeyAgreement();
        /**
         * Derive a new key pair and return the public key.  Otherwise, return a
         * previously cached public key.
         */
        this.x25519_public_key = function () {
            if (_this.ourPk === undefined) {
                _this.ourPk = _this.x25519.offer();
            }
            return _this.ourPk;
        };
        /**
         * Complete the ECDH operation in order to obtain a shared secret.
         *
         * See https://en.wikipedia.org/wiki/Elliptic-curve_Diffie%E2%80%93Hellman for
         * further details.
         */
        this.diffie_hellman = function (their_pk, secret_length) {
            if (secret_length === void 0) { secret_length = 32; }
            _this.finish(their_pk);
            var raw_shared_key = _this.x25519.getSharedKey();
            /*
             * RFC 7748 recommends applying a KDF to the raw shared key.
             *
             * Refer to https://en.wikipedia.org/wiki/Key_derivation_function for
             * further details.
             */
            var hkdf = new hkdf_1.HKDF(sha256_1.SHA256, raw_shared_key, _this.hkdfSalt);
            return hkdf.expand(secret_length);
        };
        this.finish = function (their_pk) {
            if (!_this.finished) {
                _this.x25519 = _this.x25519.finish(their_pk);
            }
        };
        this.hkdfSalt = (0, exports.hashWhenTooLong)(context);
        this.x25519 = new keyagreement_1.X25519KeyAgreement(seed);
    }
    /**
     * Instantiate a new key agreement using a keypair generated from a seed.
     * Generally, this method should be avoided and `new` should be used in its
     * place.
     */
    DiffieHellman.from_seed = function (seed, salt) {
        if (salt === void 0) { salt = new Uint8Array(0); }
        return new DiffieHellman(salt, seed);
    };
    /**
     * Instantiate a new key agreement using a randomly generated keypair.
     */
    DiffieHellman.new = function (salt) {
        if (salt === void 0) { salt = new Uint8Array(0); }
        return new DiffieHellman(salt);
    };
    return DiffieHellman;
}());
