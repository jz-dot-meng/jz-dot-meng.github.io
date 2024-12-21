import { Keypair } from "@solana/web3.js";
import { USER_PK_KEY } from "@utils/storage/constants";
import { LocalStorage } from "@utils/storage/local-storage";
import { Chain, UserLocalPrivateKey } from "@utils/types/user";
import { encodeBase58, Wallet } from "ethers";
import {
    buildMessage,
    fastSignMesage,
    formatPartialABNFMessage,
    SignMessageParams,
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
        switch (userData.privateKeyType) {
            case "evm": {
                const abnfMsg = formatPartialABNFMessage(userData, messageParams);
                const body = buildMessage(abnfMsg);
                const signature = fastSignMesage(new Wallet(userData.privateKey), body);
                const token = Buffer.from(
                    JSON.stringify({
                        signature,
                        body,
                    }),
                    "utf-8"
                ).toString("base64");

                return token;
            }
            case "svm": {
                throw "not yet implemented";
            }
        }
    }
}
