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

const API_BASE_URL = 'https://trusted-contract-main-api.ntls.io'
const ISSUER = 'rHqubSujbYhxBRYvdb63RMQYdE5AXJSCbT'
const ESCROW = 'rs87c62UQPGWRUddpbtws2GPn2Bj4khAgm'
const ESCROW_PUBLIC_KEY =
    '03A9FACA59447F3059C66D1574B9B20DE106DE6339BAF4D9BB89D70B6560D8341D'

// Function to create an instance of Axios with default configuration
function createAxiosInstance(): AxiosInstance {
    return axios.create({
        baseURL: API_BASE_URL,
    })
}

export async function createUnsignedTransaction(
    recipient: string,
    currency_code: string,
    amount: number
): Promise<xrpl.Payment> {
    const fromAddress = ESCROW
    const toAddress = recipient
    let convertedAmount: string | IssuedCurrencyAmount = ''
    if (currency_code === 'XRP') {
        convertedAmount = xrpl.xrpToDrops(amount)
    } else {
        convertedAmount = {
            currency: currency_code,
            issuer: ISSUER,
            value: amount.toString(),
        }
    }

    const unsignedTx = await xrplService.createUnsignedPaymentTransaction(
        fromAddress,
        toAddress,
        convertedAmount
    )
    // console.log('Create Unsigned Transaction:', unsignedTx)
    return unsignedTx
}

export async function signTransactionAndSubmit(
    unsignedTx: xrpl.Payment
): Promise<boolean | undefined> {
    try {
        const { txnBeingSigned, bytesToSignEncoded } = txnBeforeSign(
            unsignedTx,
            ESCROW_PUBLIC_KEY
        )

        const transactionToSign = {
            XrplTransaction: {
                transaction_bytes: hexToUint8Array(bytesToSignEncoded),
            },
        }

        const signRequest = {
            wallet_id: ESCROW,
            transaction_to_sign: transactionToSign,
        }

        // console.log('Signed Transactions:')
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
                        xrplService.submitAndWaitForSigned(txnSignedEncoded),
                    txnSignedEncoded
                )
                const txSucceeded = checkTxResponseSucceeded(txResponse)

                console.log(txResponse)

                // 5. Call update_last_paid
                if (txSucceeded.succeeded) {
                    console.log('** Payments SUCCESS')
                    return true
                } else {
                    console.log('** Payments FAILED')
                    console.log(txSucceeded)
                    return false
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
    } catch (error) {
        console.error('Error occurred:', error)
    }
}

async function main() {
    const xrpPayment = await createUnsignedTransaction(
        'rB97aE2iNAcoSwmRNbm3ycXad6ST5c2V2G',
        'XRP',
        2
    )
    await signTransactionAndSubmit(xrpPayment)
}
