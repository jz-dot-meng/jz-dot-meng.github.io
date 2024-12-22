import { PublicKey } from "@solana/web3.js";
import { Chain } from "@utils/types/user";
import { recoverAddress, Signature } from "ethers";
import { fromHexString, verify } from "./encoding";
import { customHashMessage } from "./message";

export const evmValidateAddress = (signature: string, body: string): string => {
    const sig = Signature.from(signature);
    const address = recoverAddress(customHashMessage(body), sig);
    return address;
};

export const svmValidateAddress = (
    signature: string,
    body: string,
    expectedAddress: string
): boolean => {
    const sigBytes = fromHexString(signature);
    return verify(
        sigBytes,
        customHashMessage(body, true),
        new PublicKey(expectedAddress).toBytes()
    );
};

export const parseChainMode = (chainMode: string): Chain => {
    switch (chainMode) {
        case "evm":
            return "evm";
        case "svm":
            return "svm";
        default:
            throw new Error("Invalid chain mode");
    }
};
