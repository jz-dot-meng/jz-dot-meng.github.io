import { decodeBase58 } from "ethers";

export const base58ToUint8Array = (b58Str: string): Uint8Array => {
    const pkInt = decodeBase58(b58Str);
    const hex = pkInt.toString(16);
    const paddedHex = hex.length % 2 === 0 ? hex : "0" + hex; // Ensure even number of hex digits
    const byteArray = new Uint8Array(paddedHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    return byteArray;
};

export const toHexString = (bytes: Uint8Array) => {
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
};

export const fromHexString = (hexString: string): Uint8Array => {
    const data = hexString.startsWith("0x") ? hexString.slice(2) : hexString;
    const matches = data.match(/.{1,2}/g);
    if (!matches) {
        throw new Error(`Invalid hex string: ${hexString}`);
    }
    const bytes = matches.map((byte) => parseInt(byte, 16));
    if (bytes.length !== 64) {
        throw new Error(`Invalid signature length: ${bytes.length} bytes`);
    }
    return new Uint8Array(bytes);
};
