import { PublicKey } from "@solana/web3.js";
import { verify } from "@solana/web3.js/src/utils/ed25519";
import { Chain } from "@utils/types/user";
import { recoverAddress, Signature } from "ethers";
import { fromHexString } from "./encoding";
import { customHashMessage, parseBody } from "./message";

export class UserValidator {
    static validateToken(mode: Chain, address: string, token: string) {
        const { signature, body } = extractBodyAndSignautre(token);
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

export const extractBodyAndSignautre = (token: string): { body: string; signature: string } => {
    if (!token || !token.length) {
        throw new Error("Token required.");
    }

    const base64_decoded = Buffer.from(token, "base64").toString("utf-8");

    if (!base64_decoded || !base64_decoded.length) {
        throw new Error("Token malformed (must be base64 encoded)");
    }

    let body: string, signature: string;

    try {
        ({ body, signature } = JSON.parse(base64_decoded));
    } catch (error) {
        throw new Error("Token malformed (unparsable JSON)");
    }

    if (!body || !body.length) {
        throw new Error("Token malformed (empty message)");
    }

    if (!signature || !signature.length) {
        throw new Error("Token malformed (empty signature)");
    }

    return { body, signature };
};

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
