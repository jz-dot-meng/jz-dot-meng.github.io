import { Keypair } from "@solana/web3.js";
import { USER_PK_KEY, USER_REMOTE_INFO } from "@utils/storage/constants";
import { LocalStorage } from "@utils/storage/local-storage";
import { Chain, User, UserLocalInfo, UserRemoteInfo } from "@utils/types/user";
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
    static getCachedUserLocalInfo(): UserLocalInfo | undefined {
        return LocalStorage.getItem(USER_PK_KEY, UserLocalInfo);
    }

    static setUserLocalInfo(userLocalInfo: UserLocalInfo) {
        LocalStorage.setItem(USER_PK_KEY, userLocalInfo);
    }

    static getCachedUserRemoteInfo(): UserRemoteInfo | undefined {
        return LocalStorage.getItem(USER_REMOTE_INFO, UserRemoteInfo);
    }

    static setUserRemoteInfo(userRemoteInfo: UserRemoteInfo) {
        LocalStorage.setItem(USER_REMOTE_INFO, userRemoteInfo);
    }

    static createUserPrivateKey(privateKeyType: Chain): UserLocalInfo {
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
        const userLocalInfo = {
            privateKeyType,
            privateKey,
        };
        LocalStorage.setItem(USER_PK_KEY, userLocalInfo);
        return userLocalInfo;
    }

    static signMessage(userData: UserLocalInfo, messageParams: SignMessageParams) {
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

// other helper functions
export const getUserAddress = (user: UserLocalInfo) => {
    switch (user.privateKeyType) {
        case "evm": {
            return new Wallet(user.privateKey).address;
        }
        case "svm": {
            return Keypair.fromSecretKey(base58ToUint8Array(user.privateKey)).publicKey.toBase58();
        }
    }
};

export const userRemoteKeys: Record<keyof UserRemoteInfo, boolean> = {
    name: true,
    pfp: true,
};
export const isUserRemoteInfoKey = (v: string): v is keyof UserRemoteInfo => {
    const keys = Object.keys(userRemoteKeys);
    return keys.includes(v);
};

export const extractUserRemoteData = (user: User): { data: UserRemoteInfo; isDefault: boolean } => {
    const address = getUserAddress(user);
    let isDefault = false;
    if (!user.name || address.slice(-5) === user.name) {
        // is default user remote data (sliced name)
        isDefault = true;
    }
    return {
        isDefault,
        data: {
            name: user.name,
            pfp: user.pfp,
        },
    };
};

export const extractUserLocalData = (user: User): UserLocalInfo => {
    return {
        privateKey: user.privateKey,
        privateKeyType: user.privateKeyType,
    };
};
