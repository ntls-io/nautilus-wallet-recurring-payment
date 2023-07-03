import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { withLoggedExchange } from './console.helpers';
import {
    SignTransactionRecurringPayment,
    SignTransactionRecurringPaymentResult,
} from './actions';
import { AttestationReport } from './attestation';
import { PublicKey, TweetNaClCrypto } from './crypto';
import { from_msgpack_as } from './msgpack';
import { seal_msgpack_as, unseal_msgpack_as } from './sealing';
/**
 * This service handles communication with the wallet enclave.
 */
export class EnclaveService {
    constructor(private http: AxiosInstance) {}

    async getEnclaveReport(): Promise<AttestationReport> {
        const bytes = await this.walletApiGetBytes('enclave-report');
        return from_msgpack_as<AttestationReport>(bytes);
    }

    async getEnclavePublicKey(): Promise<PublicKey> {
        const report: AttestationReport = await this.getEnclaveReport();
        // XXX: msgpack returns Array<number>: coerce to Uint8Array for tweetnacl
        return new Uint8Array(report.enclave_public_key);
    }

    async signTransactionRecurringPayment(
        request: SignTransactionRecurringPayment
    ): Promise<SignTransactionRecurringPaymentResult> {
        const walletRequest = { SignTransactionRecurringPayment: request };
        const response = await this.postSealedExchange<
            { SignTransactionRecurringPayment: SignTransactionRecurringPayment },
            { SignTransactionRecurringPayment: SignTransactionRecurringPaymentResult }
        >(walletRequest);
        const { SignTransactionRecurringPayment: result } = response;
        return result;
    }

    // HTTP helpers

    protected async walletApiGetBytes(path: string): Promise<Uint8Array> {
        const url = this.getWalletApiUrl(path);
        const response = await this.http.get<ArrayBuffer>(url, {
            responseType: 'arraybuffer',
        });

        //return arrayViewFromBuffer(bufferToArrayBuffer(response.data));
        return arrayViewFromBuffer((response.data));
    }

    protected async walletApiPostBytes(
        path: string,
        bytes: Uint8Array
    ): Promise<Uint8Array> {
        const url = this.getWalletApiUrl(path);
        const config: AxiosRequestConfig = {
            responseType: 'arraybuffer',
        };
        const response = await this.http.post<ArrayBuffer>(url, bytes, config);
        return arrayViewFromBuffer(response.data);
    }

    protected async postSealedExchange<Request, Response>(
        request: Request
    ): Promise<Response> {
        return withLoggedExchange(
            'EnclaveService.postSealedExchange:',
            () => this.postSealedExchangeInner(request),
            request
        );
    }

    protected async postSealedExchangeInner<Request, Response>(
        request: Request
    ): Promise<Response> {
        const clientCrypto = TweetNaClCrypto.new();

        const enclavePublicKey = await this.getEnclavePublicKey();

        const sealedRequestBytes = seal_msgpack_as<Request>(
            request,
            enclavePublicKey,
            clientCrypto
        );
        const sealedResponseBytes = await this.walletApiPostBytes(
            'wallet-operation',
            sealedRequestBytes
        );
        const response = unseal_msgpack_as<Response>(
            sealedResponseBytes,
            clientCrypto
        );
        if (response !== null) {
            return response;
        } else {
            console.error('XXX unsealing failed:', { sealedResponseBytes });
            throw new Error('unsealing response failed!');
        }
    }

    // Configuration helpers:

    protected getWalletApiUrl(path: string): string {
        return new URL(path, "https://wallet-staging-api.ntls.io/"  ).toString();
    }
}

// Convert bytes between typed array views and buffers.
//
// Note that these types are similar and closely related, but not interchangeable:
// code that expects an ArrayBuffer may fail if given a Uint8Array, and vice versa.
//
// Also, note that TypeScript's type system does not actually distinguish these two,
// so this code checks the types at run-time to avoid hard-to-diagnose errors.

export const arrayViewFromBuffer = (buffer: ArrayBuffer): Uint8Array => {
    return new Uint8Array(buffer);
};

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