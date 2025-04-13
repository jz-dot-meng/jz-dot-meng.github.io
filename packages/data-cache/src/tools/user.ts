import { Keypair } from "@solana/web3.js";
import { Wallet } from "ethers";
import { UserLocalInfo, UserRemoteInfo } from "../types/user";
import { base58ToUint8Array } from "./encoding";

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
    displayName: true,
    pfpUrl: true,
};
export const isUserRemoteInfoKey = (v: string): v is keyof UserRemoteInfo => {
    const keys = Object.keys(userRemoteKeys);
    return keys.includes(v);
};
