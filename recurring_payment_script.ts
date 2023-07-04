import axios, { AxiosInstance } from 'axios'
import * as xrpl from 'xrpl'

import { XrplService } from './xrpl.service'
import { EnclaveService } from './enclave.service'
import {
    checkTxResponseSucceeded,
    hexToUint8Array,
    txnAfterSign,
    txnBeforeSign,
    uint8ArrayToHex,
} from './xrpl.util'
import { withLoggedExchange } from './console.helpers'
import { panic } from './panic'
import { IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common'

// Create instances of XrplService and EnclaveService
const xrplService = new XrplService()
const enclaveService = new EnclaveService(createAxiosInstance())

const API_BASE_URL = 'https://wallet-staging-api.ntls.io'

// Function to create an instance of Axios with default configuration
function createAxiosInstance(): AxiosInstance {
    return axios.create({
        baseURL: API_BASE_URL,
    })
}

// Function to call the check_recurring_payments API
async function checkRecurringPayments() {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/recurring/payments/today`
        )
        const recurringPayments = response.data
        // Process the recurring payments as needed
        console.log('1. Check Recurring Payments:', recurringPayments)

        for (const payment of recurringPayments) {
            // 2. Create unsigned transactions
            const { wallet_id, recipient, amount, currency_code } = payment
            const fromAddress = wallet_id
            const toAddress = recipient
            let convertedAmount: string | IssuedCurrencyAmount = ''
            if (currency_code === 'XRP') {
                console.log('Currency Code is XRP')
                convertedAmount = xrpl.xrpToDrops(amount)
            } else {
                console.log('Currency Code is a TOKEN')
                convertedAmount = {
                    currency: currency_code,
                    issuer: 'rpJv16Qmn2rQP6UC6UFsNRnVy5arkQihPP', // FOO issuer
                    value: amount.toString(),
                }
            }

            const unsignedTx =
                await xrplService.createUnsignedPaymentTransaction(
                    fromAddress,
                    toAddress,
                    convertedAmount
                )
            console.log('2. Create Unsigned Transaction:', unsignedTx)

            // 3. Sign transactions
            const { txnBeingSigned, bytesToSignEncoded } = txnBeforeSign(
                unsignedTx,
                payment.wallet_public_key
            )

            const transactionToSign = {
                XrplTransaction: {
                    transaction_bytes: hexToUint8Array(bytesToSignEncoded),
                },
            }

            const signRequest = {
                wallet_id: fromAddress,
                transaction_to_sign: transactionToSign,
            }

            console.log('3. Signed Transactions:')
            const signResult = await withLoggedExchange(
                'EnclaveService.signTransactionRecurringPayment:',
                async () =>
                    enclaveService.signTransactionRecurringPayment(signRequest),
                signRequest
            )

            if ('Signed' in signResult) {
                const signed = signResult.Signed
                if ('XrplTransactionSigned' in signed) {
                    const { signature_bytes } = signed.XrplTransactionSigned

                    const txnSignedEncoded = txnAfterSign(
                        txnBeingSigned,
                        uint8ArrayToHex(signature_bytes)
                    ).txnSignedEncoded

                    // 4. Submit transactions
                    const txResponse = await withLoggedExchange(
                        '4. Submit transaction: signed, submitting:',
                        async () =>
                            xrplService.submitAndWaitForSigned(
                                txnSignedEncoded
                            ),
                        txnSignedEncoded
                    )
                    const txSucceeded = checkTxResponseSucceeded(txResponse)

                    console.log(txResponse)

                    // 5. Call update_last_paid
                    if (txSucceeded.succeeded) {
                        const today = new Date()
                        console.log('Today:', today)
                        const ordinalValue = getDateToOrdinal(today)
                        console.log('ordidnalValue: ', ordinalValue)
                        await updateLastPaid(payment.id, ordinalValue)

                        console.log(
                            `[${ordinalValue}] Last paid date updated successfully for recurring payment ID ${payment.id}`
                        )
                    }
                } else {
                    throw panic(
                        'SessionXrplService.sendTransaction: expected XrplTransactionSigned, got:',
                        signed
                    )
                }
            } else if ('Failed' in signResult) {
                throw panic(
                    `signTransactionRecurringPayment failed: ${signResult.Failed}`,
                    signResult
                )
            }
        }
    } catch (error) {
        console.error('Error occurred:', error)
    }
}

// Function to call the update_last_paid API
async function updateLastPaid(
    recurring_payment_id: string,
    last_paid_date: number
) {
    try {
        await axios.put(
            `${API_BASE_URL}/recurring/payment/update-last-paid-date`,
            {
                recurring_payment_id,
                last_paid_date,
            }
        )
    } catch (error) {
        console.error('Error occurred while updating last paid date:', error)
    }
}

checkRecurringPayments()

const _DAYS_IN_MONTH: number[] = [
    -1, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
]

function isLeapYear(year: number): boolean {
    // year -> 1 if leap year, else 0.
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}

function getDateToOrdinal(date: Date): number {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return (
        (year - 1) * 365 +
        Math.floor((year - 1) / 4) -
        Math.floor((year - 1) / 100) +
        Math.floor((year - 1) / 400) +
        _DAYS_IN_MONTH.slice(1, month).reduce((acc, curr) => acc + curr, 0) +
        (month > 2 && isLeapYear(year) ? 1 : 0) +
        day
    )
}
