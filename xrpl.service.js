"use strict";
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
exports.XrplService = void 0;
var panic_1 = require("./panic");
var xrpl = require("xrpl");
/**
 * This service wraps an instance of the xrpl {@link xrpl.Client},
 * configured from {@link environment.xrplClient}.
 *
 * Responsibilities:
 *
 * - Create, submit, and confirm transactions
 */
var XrplService = /** @class */ (function () {
    function XrplService() {
        // Call this once on construction as a smoke test.
        this.getClient();
    }
    /**
     * Ping the server, to test connectivity.
     *
     * @see https://xrpl.org/ping.html
     */
    XrplService.prototype.ping = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.withConnection(function (client) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, client.request({ command: 'ping' })];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); })];
            });
        });
    };
    /**
     * Retrieve information about an account, its activity, and its XRP balance.
     *
     * This call defaults to:
     *
     * - `ledger_index: 'validated'`
     * - `strict: true`
     *
     * @see https://xrpl.org/account_info.html
     */
    XrplService.prototype.getAccountInfo = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.withConnection(function (client) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, client.request(__assign(__assign({ ledger_index: 'validated', strict: true }, request), { command: 'account_info' }))];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieve information about an account's trust lines.
     *
     * This call defaults to:
     *
     * - `ledger_index: 'validated'`
     *
     * @see https://xrpl.org/account_lines.html
     */
    XrplService.prototype.getAccountLines = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.withConnection(function (client) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, client.request(__assign(__assign({ ledger_index: 'validated' }, request), { command: 'account_lines' }))];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Wrap {@link xrpl.Client.getBalances}.
     *
     * @see https://js.xrpl.org/classes/Client.html#getBalances
     */
    XrplService.prototype.getBalances = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.withConnection(function (client) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, client.getBalances(address)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    XrplService.prototype.createUnsignedPaymentTransaction = function (fromAddress, toAddress, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var unpreparedTx;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        unpreparedTx = {
                            Account: fromAddress,
                            TransactionType: 'Payment',
                            Amount: amount,
                            Destination: toAddress,
                            DestinationTag: 0,
                        };
                        return [4 /*yield*/, this.withConnection(function (client) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, client.autofill(unpreparedTx)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    XrplService.prototype.createUnsignedDeleteTransaction = function (fromAddress, toAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var unpreparedTx, tX;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        unpreparedTx = {
                            Account: fromAddress,
                            TransactionType: 'AccountDelete',
                            Destination: toAddress,
                        };
                        return [4 /*yield*/, this.withConnection(function (client) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, client.autofill(unpreparedTx)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); })];
                    case 1:
                        tX = _a.sent();
                        return [2 /*return*/, tX];
                }
            });
        });
    };
    XrplService.prototype.createUnsignedTrustSetTx = function (fromAddress, limitAmount, flags) {
        return __awaiter(this, void 0, void 0, function () {
            var unpreparedTx;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        unpreparedTx = {
                            Account: fromAddress,
                            TransactionType: 'TrustSet',
                            LimitAmount: limitAmount,
                        };
                        if (typeof flags !== 'undefined') {
                            unpreparedTx.Flags = flags;
                        }
                        return [4 /*yield*/, this.withConnection(function (client) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, client.autofill(unpreparedTx)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Submit and wait for a signed transaction.
     *
     * @see https://js.xrpl.org/classes/Client.html#submitAndWait
     * @see https://xrpl.org/reliable-transaction-submission.html
     */
    XrplService.prototype.submitAndWaitForSigned = function (signedTxEncoded) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.withConnection(function (client) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, client.submitAndWait(signedTxEncoded)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieves a list of transactions that involved the specified account
     *
     * @see https://js.xrpl.org/interfaces/AccountTxRequest.html
     */
    XrplService.prototype.getAccountTx = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.withConnection(function (client) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, client.request({
                                            command: 'account_tx',
                                            account: account,
                                        })];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // For Reference: https://github.com/XRPLF/xrpl.js/blob/6e4868e6c7a03f0d48de1ddee5d9a88700ab5a7c/src/transaction/sign.ts#L54
    /*
    async submitTransaction(
      tx: TransactionJSON,
      signature: string
    ): Promise<FormattedSubmitResponse> {
      const signedTx: TransactionJSON = { ...tx, TxnSignature: signature };

      const encodedTx = binaryCodec.encode(signedTx);

      await this.xrplClient.connect();
      const res = await this.xrplClient.submit(encodedTx);
      await this.xrplClient.disconnect();

      if (res.resultCode !==  'tesSUCCESS') {
        throw new Error('');
      } else {
        console.log(res);
        return res;
      }
    }
  */
    /**
     * Run `f` with a connected {@link xrpl.Client}.
     *
     * In particular, this runs each request with a separate client instance,
     * to avoid state conflicts.
     */
    XrplService.prototype.withConnection = function (f) {
        return __awaiter(this, void 0, void 0, function () {
            var xrplClient;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        xrplClient = this.getClient();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 4, 6]);
                        return [4 /*yield*/, xrplClient.connect()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, f(xrplClient)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [4 /*yield*/, xrplClient.disconnect()];
                    case 5:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    XrplService.prototype.getClient = function () {
        var xrplClient = {
            server: 'wss://s.altnet.rippletest.net:51233',
            options: {
                connectionTimeout: 20000,
            },
        };
        var _a = (0, panic_1.defined)(xrplClient, 'xrplClient not configured'), server = _a.server, options = _a.options;
        return new xrpl.Client(server, options);
    };
    return XrplService;
}());
exports.XrplService = XrplService;
