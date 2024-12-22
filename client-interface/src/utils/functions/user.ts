import { Keypair } from "@solana/web3.js";
import { USER_PK_KEY, USER_REMOTE_INFO } from "@utils/storage/constants";
import { LocalStorage } from "@utils/storage/local-storage";
import { Chain, UserLocalPrivateKey, UserRemoteInfo } from "@utils/types/user";
import { encodeBase58, Wallet } from "ethers";
import { base58ToUint8Array } from "./encoding";
import {
    buildMessage,
    evmFastSignMesage,
    extractBodyAndSignature,
    formatPartialABNFMessage,
    parseBody,
    SignMessageParams,
    svmFastSignMessage,
} from "./message";
import { evmValidateAddress, svmValidateAddress } from "./validator";

export const PROOF_OF_OWNERSHIP_MESSAGE =
    "[jzmeng] the signing of this message proves that you own the private key associated with this account";

export class LocalUserManagement {
    static getUserPrivateKey(): UserLocalPrivateKey | undefined {
        return LocalStorage.getItem(USER_PK_KEY, UserLocalPrivateKey);
    }

    static getCachedUserRemoteInfo(): UserRemoteInfo | undefined {
        return LocalStorage.getItem(USER_REMOTE_INFO, UserRemoteInfo);
    }

    static setUserRemoteInfo(userRemoteInfo: UserRemoteInfo) {
        LocalStorage.setItem(USER_REMOTE_INFO, userRemoteInfo);
    }

    static createUserPrivateKey(privateKeyType: Chain): UserLocalPrivateKey {
        let privateKey: string;
        switch (privateKeyType) {
            case "evm": {
                privateKey = Wallet.createRandom().privateKey;
                break;
            }
            case "svm": {
                privateKey = encodeBase58(Keypair.generate().secretKey);
                break;
            }
        }
        const userLocalPrivateKey = {
            privateKeyType,
            privateKey,
        };
        LocalStorage.setItem(USER_PK_KEY, userLocalPrivateKey);
        return userLocalPrivateKey;
    }

    static signMessage(userData: UserLocalPrivateKey, messageParams: SignMessageParams) {
        const abnfMsg = formatPartialABNFMessage(userData, messageParams);
        const body = buildMessage(abnfMsg);
        let signature: string;
        switch (userData.privateKeyType) {
            case "evm": {
                signature = evmFastSignMesage(new Wallet(userData.privateKey), body);
                break;
            }
            case "svm": {
                const pkBytes = base58ToUint8Array(userData.privateKey);
                signature = svmFastSignMessage(Keypair.fromSecretKey(pkBytes), body);
                break;
            }
        }
        const token = Buffer.from(
            JSON.stringify({
                signature,
                body,
            }),
            "utf-8"
        ).toString("base64");

        return token;
    }
}

export class UserValidator {
    static validateToken(mode: Chain, address: string, token: string) {
        const { signature, body } = extractBodyAndSignature(token);
        switch (mode) {
            case "evm": {
                const signingAddress = evmValidateAddress(signature, body);
                if (address !== signingAddress) {
                    throw new Error("Address mismatch [evm]");
                }
                break;
            }
            case "svm": {
                const isValid = svmValidateAddress(signature, body, address);
                if (!isValid) {
                    throw new Error("Address mismatch [svm]");
                }
                break;
            }
        }
        const lines = body.split("\n");
        const parsedBody = parseBody(lines);
        if (parsedBody.expirationTime && parsedBody.expirationTime < new Date()) {
            throw new Error("Token expired");
        }

        return parsedBody;
    }
}
