"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayViewFromBuffer = exports.EnclaveService = void 0;
var console_helpers_1 = require("./console.helpers");
var crypto_1 = require("./crypto");
var msgpack_1 = require("./msgpack");
var sealing_1 = require("./sealing");
/**
 * This service handles communication with the wallet enclave.
 */
var EnclaveService = /** @class */ (function () {
    function EnclaveService(http) {
        this.http = http;
    }
    EnclaveService.prototype.getEnclaveReport = function () {
        return __awaiter(this, void 0, void 0, function () {
            var bytes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.walletApiGetBytes('enclave-report')];
                    case 1:
                        bytes = _a.sent();
                        return [2 /*return*/, (0, msgpack_1.from_msgpack_as)(bytes)];
                }
            });
        });
    };
    EnclaveService.prototype.getEnclavePublicKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var report;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getEnclaveReport()
                        // XXX: msgpack returns Array<number>: coerce to Uint8Array for tweetnacl
                    ];
                    case 1:
                        report = _a.sent();
                        // XXX: msgpack returns Array<number>: coerce to Uint8Array for tweetnacl
                        return [2 /*return*/, new Uint8Array(report.enclave_public_key)];
                }
            });
        });
    };
    EnclaveService.prototype.signTransactionRecurringPayment = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var walletRequest, response, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        walletRequest = { SignTransactionRecurringPayment: request };
                        return [4 /*yield*/, this.postSealedExchange(walletRequest)];
                    case 1:
                        response = _a.sent();
                        result = response.SignTransactionRecurringPayment;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // HTTP helpers
    EnclaveService.prototype.walletApiGetBytes = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.getWalletApiUrl(path);
                        return [4 /*yield*/, this.http.get(url, {
                                responseType: 'arraybuffer',
                            })
                            //return arrayViewFromBuffer(bufferToArrayBuffer(response.data));
                        ];
                    case 1:
                        response = _a.sent();
                        //return arrayViewFromBuffer(bufferToArrayBuffer(response.data));
                        return [2 /*return*/, (0, exports.arrayViewFromBuffer)(response.data)];
                }
            });
        });
    };
    EnclaveService.prototype.walletApiPostBytes = function (path, bytes) {
        return __awaiter(this, void 0, void 0, function () {
            var url, config, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.getWalletApiUrl(path);
                        config = {
                            responseType: 'arraybuffer',
                        };
                        return [4 /*yield*/, this.http.post(url, bytes, config)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, exports.arrayViewFromBuffer)(response.data)];
                }
            });
        });
    };
    EnclaveService.prototype.postSealedExchange = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, console_helpers_1.withLoggedExchange)('EnclaveService.postSealedExchange:', function () { return _this.postSealedExchangeInner(request); }, request)];
            });
        });
    };
    EnclaveService.prototype.postSealedExchangeInner = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var clientCrypto, enclavePublicKey, sealedRequestBytes, sealedResponseBytes, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clientCrypto = crypto_1.TweetNaClCrypto.new();
                        return [4 /*yield*/, this.getEnclavePublicKey()];
                    case 1:
                        enclavePublicKey = _a.sent();
                        sealedRequestBytes = (0, sealing_1.seal_msgpack_as)(request, enclavePublicKey, clientCrypto);
                        return [4 /*yield*/, this.walletApiPostBytes('wallet-operation', sealedRequestBytes)];
                    case 2:
                        sealedResponseBytes = _a.sent();
                        response = (0, sealing_1.unseal_msgpack_as)(sealedResponseBytes, clientCrypto);
                        if (response !== null) {
                            return [2 /*return*/, response];
                        }
                        else {
                            console.error('XXX unsealing failed:', { sealedResponseBytes: sealedResponseBytes });
                            throw new Error('unsealing response failed!');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // Configuration helpers:
    EnclaveService.prototype.getWalletApiUrl = function (path) {
        return new URL(path, 'https://trusted-contract-main-api.ntls.io/').toString();
    };
    return EnclaveService;
}());
exports.EnclaveService = EnclaveService;
// Convert bytes between typed array views and buffers.
//
// Note that these types are similar and closely related, but not interchangeable:
// code that expects an ArrayBuffer may fail if given a Uint8Array, and vice versa.
//
// Also, note that TypeScript's type system does not actually distinguish these two,
// so this code checks the types at run-time to avoid hard-to-diagnose errors.
var arrayViewFromBuffer = function (buffer) {
    return new Uint8Array(buffer);
};
exports.arrayViewFromBuffer = arrayViewFromBuffer;
/**
 * Converts a Node.js Buffer object to an ArrayBuffer.
 * @param buffer The Buffer object to convert.
 * @returns The converted ArrayBuffer.
 */
// function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
//     const arrayBuffer = new ArrayBuffer(buffer.length);
//     const view = new Uint8Array(arrayBuffer);
//     for (let i = 0; i < buffer.length; i++) {
//         view[i] = buffer[i];
//     }
//     return arrayBuffer;
// }
