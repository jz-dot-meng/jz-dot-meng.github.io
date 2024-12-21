import { Keypair } from "@solana/web3.js";
import { sign } from "@solana/web3.js/src/utils/ed25519";
import { UserLocalPrivateKey } from "@utils/types/user";
import { concat, keccak256, toUtf8Bytes, Wallet } from "ethers";
import { getDaysFromNow } from "./datetime";
import { base58ToUint8Array, toHexString } from "./encoding";

export interface SignMessageParams {
    statement: string;
    expiresInDays: number;
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

// erc4361 rfc3986, cannot have line feed
export const validateMessage = (message: string) => {
    if (/\n/.test(message)) {
        throw "Message cannot contain LF (\\n)";
    }
};

export const formatPartialABNFMessage = (
    userData: UserLocalPrivateKey,
    params: SignMessageParams
): PartialABNFMessage => {
    validateMessage(params.statement);
    const address = (() => {
        switch (userData.privateKeyType) {
            case "evm": {
                const wallet = new Wallet(userData.privateKey);
                return wallet.address;
            }
            case "svm": {
                const pkBytes = base58ToUint8Array(userData.privateKey);
                return Keypair.fromSecretKey(pkBytes).publicKey.toBase58();
            }
        }
    })();
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
    const expirationTime = getDaysFromNow(params.expiresInDays);
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

    const paramLabels = {
        URI: abnf.uri,
        "Chain ID": abnf.chainId,
        Nonce: abnf.nonce,
        "Issued At": abnf.issuedAt.toISOString(),
        "Expiration Time": abnf.expirationTime.toISOString(),
        "Not Before": abnf.notBefore ? abnf.notBefore.toISOString() : undefined,
        "Request ID": abnf.requestId,
    };
    for (const label in paramLabels) {
        if (paramLabels[label] !== undefined) {
            message.push(`${label}: ${paramLabels[label]}`);
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

// we don't want to prepend the message with "\\x19Ethereum Signed Message:\\n"
// also this can be shared between EVM and SVM
export const customHashMessage = (message: string, omit0x: boolean = false) => {
    let msg: Uint8Array;
    if (typeof message === "string") {
        msg = toUtf8Bytes(message);
    }
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
