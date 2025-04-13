import { PublicKey } from "@solana/web3.js";
import { recoverAddress, Signature } from "ethers";
import { Chain } from "../types/user";
import { fromHexString, verify } from "./encoding";
import { customHashMessage, extractBodyAndSignature, parseBody } from "./message";

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

export const validateToken = (mode: Chain, address: string, token: string) => {
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
};
