import { Keypair } from "@solana/web3.js";
import { USER_PK_KEY } from "@utils/storage/constants";
import { LocalStorage } from "@utils/storage/local-storage";
import { Chain, UserLocalPrivateKey } from "@utils/types/user";
import { encodeBase58, Wallet } from "ethers";
import { base58ToUint8Array } from "./encoding";
import {
    buildMessage,
    evmFastSignMesage,
    formatPartialABNFMessage,
    SignMessageParams,
    svmFastSignMessage,
} from "./message";

export const PROOF_OF_OWNERSHIP_MESSAGE =
    "[jzmeng] the signing of this message proves that you own the private key associated with this account";

export class LocalUserManagement {
    static getUserPrivateKey(): UserLocalPrivateKey | undefined {
        return LocalStorage.getItem(USER_PK_KEY, UserLocalPrivateKey);
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
