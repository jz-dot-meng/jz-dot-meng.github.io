import { Wallet } from "ethers";
import { describe, expect, test } from "vitest";
import { LocalUserManagement } from "./user";
import { UserValidator } from "./validator";

describe("decrypt", () => {
    test("encodes and decrypts a message correctly", () => {
        const wallet = new Wallet(Wallet.createRandom().privateKey);
        const signedMessage = LocalUserManagement.signMessage(
            { privateKeyType: "evm", privateKey: wallet.privateKey },
            { statement: "test", expiresInDays: 1 }
        );

        const decrypted = UserValidator.validateToken("evm", wallet.address, signedMessage);
        expect(decrypted.address).toBe(wallet.address);
        expect(decrypted.statement).toBe("test");
    });
});
