//! Based off the internal logic of https://github.com/bytesbay/web3-token
import { Keypair } from "@solana/web3.js";
import { UserLocalInfo } from "@utils/types/user";
import { concat, keccak256, toUtf8Bytes, Wallet } from "ethers";
import { getDaysFromNow } from "./datetime";
import { sign, toHexString } from "./encoding";
import { getUserAddress } from "./user";

export interface SignMessageParams {
    statement: string;
    expiresInDays?: number;
}

// partial ABNF message, because we're not actually rendering it for the user
export interface PartialABNFMessage {
    address: string;
    statement: string;
    uri: string;
    version: "1";
    chainId: number;
    nonce: number;
    issuedAt: Date;
    expirationTime?: Date;
    notBefore?: Date;
    requestId?: string;
    resources?: string[];
}

export const ABNFLabels: Record<keyof PartialABNFMessage, string> = {
    address: "Address",
    statement: "Statement",
    uri: "URI",
    version: "Version",
    chainId: "Chain ID",
    nonce: "Nonce",
    issuedAt: "Issued At",
    expirationTime: "Expiration Time",
    notBefore: "Not Before",
    requestId: "Request ID",
    resources: "Resources",
};

// erc4361 rfc3986, cannot have line feed
export const validateMessage = (message: string) => {
    if (/\n/.test(message)) {
        throw "Message cannot contain LF (\\n)";
    }
};

export const formatPartialABNFMessage = (
    userData: UserLocalInfo,
    params: SignMessageParams
): PartialABNFMessage => {
    validateMessage(params.statement);
    const address = getUserAddress(userData);
    const chainId = (() => {
        switch (userData.privateKeyType) {
            case "evm": {
                return 1;
            }
            case "svm": {
                return 101;
            }
        }
    })();
    const expirationTime = params.expiresInDays ? getDaysFromNow(params.expiresInDays) : undefined;
    const uri = "https://jz-dot-meng.vercel.app";
    const nonce = parseInt(String(Math.random() * 99999999));

    const message: PartialABNFMessage = {
        address: address,
        statement: params.statement,
        uri: uri,
        version: "1",
        chainId,
        nonce,
        issuedAt: new Date(),
        expirationTime,
    };
    return message;
};

export const buildMessage = (abnf: PartialABNFMessage) => {
    const message: string[] = [];
    message.push(`${abnf.statement}`);
    message.push("");
    message.push(`${abnf.address}`);
    message.push("");

    for (const key of Object.keys(abnf) as (keyof PartialABNFMessage)[]) {
        const value = abnf[key];
        if (value == undefined) continue;
        if (value instanceof Date) {
            message.push(`${ABNFLabels[key]}: ${value.toISOString()}`);
        } else {
            message.push(`${ABNFLabels[key]}: ${value.toString()}`);
        }
    }

    return message.join("\n");
};

export type MessageSections = string[][];
export const parseBody = (lines: string[]) => {
    const sections = splitSections(lines);

    const statement = sections[0];

    const address = sections[1][0];

    const details = sections[sections.length - 1];

    const msg: PartialABNFMessage = {
        address,
        statement: statement.filter((s) => s !== "").join("\n"),
        uri: "",
        version: "1",
        chainId: 0,
        nonce: 0,
        issuedAt: new Date(),
    };

    for (const detail of details) {
        const [key, value] = detail.split(": ").map((s) => s.trim());
        switch (key) {
            case "URI":
                msg.uri = value;
                break;
            case "Chain ID":
                msg.chainId = parseInt(value);
                break;
            case "Nonce":
                msg.nonce = parseInt(value);
                break;
            case "Issued At":
                msg.issuedAt = new Date(value);
                break;
            case "Expiration Time":
                msg.expirationTime = new Date(value);
                break;
            case "Not Before":
                msg.notBefore = new Date(value);
                break;
            case "Request ID":
                msg.requestId = value;
                break;
        }
    }
    return msg;
};

const splitSections = (lines: string[]): MessageSections => {
    const sections: MessageSections = [[]];
    let section_number = 0;
    for (const line of lines) {
        sections[section_number].push(line);
        if (line === "") {
            section_number++;
            sections.push([]);
        }
    }

    return sections;
};

export const extractBodyAndSignature = (token: string): { body: string; signature: string } => {
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

// we don't want to prepend the message with "\\x19Ethereum Signed Message:\\n"
// also this can be shared between EVM and SVM
export const customHashMessage = (message: string, omit0x = false) => {
    const msg: Uint8Array = toUtf8Bytes(message);
    const hashed = keccak256(concat([toUtf8Bytes(String(msg.length)), msg]));
    return omit0x ? hashed.slice(2) : hashed;
};

/* -------------------------------------------------------------------------- */
/*                                     EVM                                    */
/* -------------------------------------------------------------------------- */

export const evmFastSignMesage = (wallet: Wallet, message: string) => {
    const signature = wallet.signingKey.sign(customHashMessage(message)).serialized;
    return signature;
};

/* -------------------------------------------------------------------------- */
/*                                     SVM                                    */
/* -------------------------------------------------------------------------- */

export const svmFastSignMessage = (wallet: Keypair, message: string) => {
    const signatureBytes = sign(customHashMessage(message, true), wallet.secretKey);
    if (signatureBytes.length !== 64) {
        throw "sig byte len not 64";
    }
    const signature = toHexString(signatureBytes);
    if (signature.length !== 128) {
        throw "sig str len not 128";
    }
    return `0x${signature}`;
};
