'use strict'
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value)
                  })
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value))
                } catch (e) {
                    reject(e)
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value))
                } catch (e) {
                    reject(e)
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected)
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
            )
        })
    }
var __generator =
    (this && this.__generator) ||
    function (thisArg, body) {
        var _ = {
                label: 0,
                sent: function () {
                    if (t[0] & 1) throw t[1]
                    return t[1]
                },
                trys: [],
                ops: [],
            },
            f,
            y,
            t,
            g
        return (
            (g = { next: verb(0), throw: verb(1), return: verb(2) }),
            typeof Symbol === 'function' &&
                (g[Symbol.iterator] = function () {
                    return this
                }),
            g
        )
        function verb(n) {
            return function (v) {
                return step([n, v])
            }
        }
        function step(op) {
            if (f) throw new TypeError('Generator is already executing.')
            while ((g && ((g = 0), op[0] && (_ = 0)), _))
                try {
                    if (
                        ((f = 1),
                        y &&
                            (t =
                                op[0] & 2
                                    ? y['return']
                                    : op[0]
                                    ? y['throw'] ||
                                      ((t = y['return']) && t.call(y), 0)
                                    : y.next) &&
                            !(t = t.call(y, op[1])).done)
                    )
                        return t
                    if (((y = 0), t)) op = [op[0] & 2, t.value]
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op
                            break
                        case 4:
                            _.label++
                            return { value: op[1], done: false }
                        case 5:
                            _.label++
                            y = op[1]
                            op = [0]
                            continue
                        case 7:
                            op = _.ops.pop()
                            _.trys.pop()
                            continue
                        default:
                            if (
                                !((t = _.trys),
                                (t = t.length > 0 && t[t.length - 1])) &&
                                (op[0] === 6 || op[0] === 2)
                            ) {
                                _ = 0
                                continue
                            }
                            if (
                                op[0] === 3 &&
                                (!t || (op[1] > t[0] && op[1] < t[3]))
                            ) {
                                _.label = op[1]
                                break
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1]
                                t = op
                                break
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2]
                                _.ops.push(op)
                                break
                            }
                            if (t[2]) _.ops.pop()
                            _.trys.pop()
                            continue
                    }
                    op = body.call(thisArg, _)
                } catch (e) {
                    op = [6, e]
                    y = 0
                } finally {
                    f = t = 0
                }
            if (op[0] & 5) throw op[1]
            return { value: op[0] ? op[1] : void 0, done: true }
        }
    }
Object.defineProperty(exports, '__esModule', { value: true })
var axios_1 = require('axios')
var xrpl = require('xrpl')
var xrpl_service_1 = require('./xrpl.service')
var enclave_service_1 = require('./enclave.service')
var xrpl_util_1 = require('./xrpl.util')
var console_helpers_1 = require('./console.helpers')
var panic_1 = require('./panic')
// Create instances of XrplService and EnclaveService
var xrplService = new xrpl_service_1.XrplService()
var enclaveService = new enclave_service_1.EnclaveService(createAxiosInstance())
var API_BASE_URL = process.env.API_BASE_URL // 'https://trusted-contract-main-api.ntls.io'
var ISSUER = process.env.ISSUER_ACCOUNT //'rHqubSujbYhxBRYvdb63RMQYdE5AXJSCbT'
var ESCROW = process.env.ESCROW_ACCOUNT //'rs87c62UQPGWRUddpbtws2GPn2Bj4khAgm'
var ESCROW_PUBLIC_KEY = process.env.ESCROW_PUBLIC_KEY //'03A9FACA59447F3059C66D1574B9B20DE106DE6339BAF4D9BB89D70B6560D8341D'
// Function to create an instance of Axios with default configuration
function createAxiosInstance() {
    return axios_1.default.create({
        baseURL: API_BASE_URL,
    })
}

exports.createUnsignedTransaction = function createUnsignedTransaction(
    recipient,
    currency_code,
    amount
) {
    return __awaiter(this, void 0, void 0, function () {
        var fromAddress, toAddress, convertedAmount, unsignedTx
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fromAddress = ESCROW
                    toAddress = recipient
                    convertedAmount = ''
                    if (currency_code === 'XRP') {
                        convertedAmount = xrpl.xrpToDrops(amount)
                    } else {
                        convertedAmount = {
                            currency: currency_code,
                            issuer: ISSUER,
                            value: amount.toString(),
                        }
                    }
                    return [
                        4 /*yield*/,
                        xrplService.createUnsignedPaymentTransaction(
                            fromAddress,
                            toAddress,
                            convertedAmount
                        ),
                        // console.log('Create Unsigned Transaction:', unsignedTx)
                    ]
                case 1:
                    unsignedTx = _a.sent()
                    // console.log('Create Unsigned Transaction:', unsignedTx)
                    return [2 /*return*/, unsignedTx]
            }
        })
    })
}

exports.signTransactionAndSubmit = function signTransactionAndSubmit(
    unsignedTx
) {
    return __awaiter(this, void 0, void 0, function () {
        var _a,
            txnBeingSigned,
            bytesToSignEncoded,
            transactionToSign,
            signRequest_1,
            signResult,
            signed,
            signature_bytes,
            txnSignedEncoded_1,
            txResponse,
            txSucceeded,
            error_1
        var _this = this
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8])
                    ;(_a = (0, xrpl_util_1.txnBeforeSign)(
                        unsignedTx,
                        ESCROW_PUBLIC_KEY
                    )),
                        (txnBeingSigned = _a.txnBeingSigned),
                        (bytesToSignEncoded = _a.bytesToSignEncoded)
                    transactionToSign = {
                        XrplTransaction: {
                            transaction_bytes: (0, xrpl_util_1.hexToUint8Array)(
                                bytesToSignEncoded
                            ),
                        },
                    }
                    signRequest_1 = {
                        wallet_id: ESCROW,
                        transaction_to_sign: transactionToSign,
                    }
                    return [
                        4 /*yield*/,
                        (0, console_helpers_1.withLoggedExchange)(
                            'EnclaveService.signTransactionRecurringPayment:',
                            function () {
                                return __awaiter(
                                    _this,
                                    void 0,
                                    void 0,
                                    function () {
                                        return __generator(this, function (_a) {
                                            return [
                                                2 /*return*/,
                                                enclaveService.signTransactionRecurringPayment(
                                                    signRequest_1
                                                ),
                                            ]
                                        })
                                    }
                                )
                            },
                            signRequest_1
                        ),
                    ]
                case 1:
                    signResult = _b.sent()
                    if (!('Signed' in signResult)) return [3 /*break*/, 5]
                    signed = signResult.Signed
                    if (!('XrplTransactionSigned' in signed))
                        return [3 /*break*/, 3]
                    signature_bytes =
                        signed.XrplTransactionSigned.signature_bytes
                    txnSignedEncoded_1 = (0, xrpl_util_1.txnAfterSign)(
                        txnBeingSigned,
                        (0, xrpl_util_1.uint8ArrayToHex)(signature_bytes)
                    ).txnSignedEncoded
                    return [
                        4 /*yield*/,
                        (0, console_helpers_1.withLoggedExchange)(
                            '4. Submit transaction: signed, submitting:',
                            function () {
                                return __awaiter(
                                    _this,
                                    void 0,
                                    void 0,
                                    function () {
                                        return __generator(this, function (_a) {
                                            return [
                                                2 /*return*/,
                                                xrplService.submitAndWaitForSigned(
                                                    txnSignedEncoded_1
                                                ),
                                            ]
                                        })
                                    }
                                )
                            },
                            txnSignedEncoded_1
                        ),
                    ]
                case 2:
                    txResponse = _b.sent()
                    txSucceeded = (0, xrpl_util_1.checkTxResponseSucceeded)(
                        txResponse
                    )
                    console.log(txResponse)
                    // 5. Call update_last_paid
                    if (txSucceeded.succeeded) {
                        console.log('Payments succeeded')
                    }
                    return [3 /*break*/, 4]
                case 3:
                    throw (0,
                    panic_1.panic)('SessionXrplService.sendTransaction: expected XrplTransactionSigned, got:', signed)
                case 4:
                    return [3 /*break*/, 6]
                case 5:
                    if ('Failed' in signResult) {
                        throw (0, panic_1.panic)(
                            'signTransactionRecurringPayment failed: '.concat(
                                signResult.Failed
                            ),
                            signResult
                        )
                    }
                    _b.label = 6
                case 6:
                    return [3 /*break*/, 8]
                case 7:
                    error_1 = _b.sent()
                    console.error('Error occurred:', error_1)
                    return [3 /*break*/, 8]
                case 8:
                    return [2 /*return*/]
            }
        })
    })
}

function main() {
    return __awaiter(this, void 0, void 0, function () {
        var xrpPayment
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    return [
                        4 /*yield*/,
                        createUnsignedTransaction(
                            'rB97aE2iNAcoSwmRNbm3ycXad6ST5c2V2G',
                            'XRP',
                            2
                        ),
                    ]
                case 1:
                    xrpPayment = _a.sent()
                    return [4 /*yield*/, signTransactionAndSubmit(xrpPayment)]
                case 2:
                    _a.sent()
                    return [2 /*return*/]
            }
        })
    })
}
