import { Keypair } from "@solana/web3.js";
import { USER_PK_KEY, USER_REMOTE_INFO } from "@utils/storage/constants";
import { LocalStorage } from "@utils/storage/local-storage";
import {
    Chain,
    evmValidateAddress,
    extractBodyAndSignature,
    getUserAddress,
    parseBody,
    svmValidateAddress,
    User,
    UserLocalInfo,
    UserRemoteInfo,
} from "data-cache";
import { encodeBase58, Wallet } from "ethers";

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

export const extractUserRemoteData = (user: User): { data: UserRemoteInfo; isDefault: boolean } => {
    const address = getUserAddress(user);
    let isDefault = false;
    if (!user.displayName || address.slice(-5) === user.displayName) {
        // is default user remote data (sliced name)
        isDefault = true;
    }
    return {
        isDefault,
        data: {
            displayName: user.displayName,
            pfpUrl: user.pfpUrl,
        },
    };
};

export const extractUserLocalData = (user: User): UserLocalInfo => {
    return {
        privateKey: user.privateKey,
        privateKeyType: user.privateKeyType,
    };
};
