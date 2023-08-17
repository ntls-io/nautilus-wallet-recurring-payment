"use strict";
/* eslint-disable max-len -- long URL in comment */
/**
 * Supporting code for XRPL.
 *
 * In particular, this provides a stand-alone implementation of the transaction
 * signing logic that's otherwise tied up in the XRPL.js wallet code.
 *
 * @todo We should look at migrating this logic entirely into the enclave?
 *
 * @see https://github.com/XRPLF/xrpl-dev-portal/blob/master/content/concepts/payment-system-basics/transaction-basics/understanding-signatures-draft.md
 * @see https://xrpl.org/serialization.html
 * @see https://github.com/XRPLF/xrpl.js/blob/xrpl%402.2.1/packages/xrpl/src/Wallet/index.ts#L257-L305
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTxResponseMetadata = exports.checkTransactionMetadataSucceeded = exports.checkTxResponseSucceeded = exports.uint8ArrayToHex = exports.hexToUint8Array = exports.txnAfterSign = exports.txnBeforeSign = void 0;
var utils_1 = require("ripple-keypairs/dist/utils");
var panic_1 = require("./panic");
var xrpl = require("xrpl");
/**
 * Prepare to sign `txnUnsigned` with `signingPubKey`.
 *
 * This returns:
 *
 * - `txnBeingSigned`: `txnUnsigned` with `SigningPubKey` added
 *
 * - `bytesToSignEncoded`: As encoded by {@link xrpl.encodeForSigning},
 *   ready for signature calculation
 */
var txnBeforeSign = function (txnUnsigned, signingPubKey) {
    var txnBeingSigned = __assign(__assign({}, txnUnsigned), { SigningPubKey: signingPubKey });
    return {
        txnBeingSigned: txnBeingSigned,
        bytesToSignEncoded: xrpl.encodeForSigning(txnBeingSigned),
    };
};
exports.txnBeforeSign = txnBeforeSign;
/**
 * Combine `txnBeingSigned` with its `txnSignature`
 *
 * This returns:
 *
 * - `txnSigned`: `txnBeingSigned` with `TxnSignature` added
 * - `txnSignedEncoded`: As encoded by {@link xrpl.encode},
 *   ready for submission
 */
var txnAfterSign = function (txnBeingSigned, txnSignature) {
    var txnSigned = __assign(__assign({}, txnBeingSigned), { TxnSignature: txnSignature });
    return { txnSigned: txnSigned, txnSignedEncoded: xrpl.encode(txnSigned) };
};
exports.txnAfterSign = txnAfterSign;
/**
 * Like {@link hexToBytes}, but produce {@link Uint8Array}.
 */
var hexToUint8Array = function (hex) {
    return Uint8Array.from((0, utils_1.hexToBytes)(hex));
};
exports.hexToUint8Array = hexToUint8Array;
/**
 * Like {@link bytesToHex}, but consume {@link Uint8Array}.
 *
 * This mainly exists to work around this bug:
 * - <https://github.com/XRPLF/xrpl.js/pull/1975>
 */
var uint8ArrayToHex = function (array) {
    return (0, utils_1.bytesToHex)(Array.from(array));
};
exports.uint8ArrayToHex = uint8ArrayToHex;
/** Check whether a transaction succeeded, by response. */
var checkTxResponseSucceeded = function (txResponse) {
    return (0, exports.checkTransactionMetadataSucceeded)((0, exports.getTxResponseMetadata)(txResponse));
};
exports.checkTxResponseSucceeded = checkTxResponseSucceeded;
/** Check whether a transaction succeeded, by metadata. */
var checkTransactionMetadataSucceeded = function (meta) { return ({
    succeeded: meta.TransactionResult === 'tesSUCCESS',
    resultCode: meta.TransactionResult,
}); };
exports.checkTransactionMetadataSucceeded = checkTransactionMetadataSucceeded;
/** Get transaction metadata from response, or panic. */
var getTxResponseMetadata = function (txResponse) {
    var meta = txResponse.result.meta;
    if (typeof meta === 'string') {
        throw (0, panic_1.panic)('getTxResponseMetadata: unexpected string meta:', {
            txResponse: txResponse,
        });
    }
    else if (meta === undefined) {
        throw (0, panic_1.panic)('getTxResponseMetadata: unexpected undefined meta:', {
            txResponse: txResponse,
        });
    }
    else {
        return meta;
    }
};
exports.getTxResponseMetadata = getTxResponseMetadata;
