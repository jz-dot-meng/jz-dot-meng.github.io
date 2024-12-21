import { Chain } from "@utils/types/user";
import { recoverAddress, Signature } from "ethers";
import { customHashMessage, parseBody } from "./message";

export class UserValidator {
    static validateToken(mode: Chain, address: string, token: string) {
        switch (mode) {
            case "evm": {
                const message = decrypt(token);
                const address = message.address;
                if (message.address !== address) {
                    throw new Error("Address mismatch");
                }
                const lines = message.body.split("\n");

                const parsedBody = parseBody(lines);

                return parsedBody;
            }
            case "svm":
        }
    }
}

export const decrypt = (token: string): { address: string; body: string; signature: string } => {
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

    const sig = Signature.from(signature);
    const address = recoverAddress(customHashMessage(body), sig);

    return {
        address,
        body,
        signature,
    };
};
