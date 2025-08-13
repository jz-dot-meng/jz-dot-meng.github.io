import type { VersionedTransaction as VersionedTransactionType } from "@utils/types/solana";
import { describe, expect, it } from "vitest";
import { isValidVersionedTransaction, mapVersionedTransaction } from "./solana";

describe("isValidVersionedTransaction", () => {
    it("should validate a correct versioned transaction", () => {
        const validTxn = {
            signatures: [
                { "0": 74, "1": 136, "2": 74 }
            ],
            message: {
                header: {
                    numRequiredSignatures: 1,
                    numReadonlySignedAccounts: 0,
                    numReadonlyUnsignedAccounts: 2
                },
                staticAccountKeys: [
                    "CFcQz7oLSE2FXPx4ckW3wyNMdw1i66PBe4wBNV9Mgnv6",
                    "shuvodtwMMFFB6KmqCDYaiAe1hRokCVwr4LkT1pLAL5"
                ],
                recentBlockhash: "4iKkxu81uLGkPUx5LyeunTSVoTnm7QiYQQhnZ9U8oPrS",
                compiledInstructions: [
                    {
                        programIdIndex: 0,
                        accountKeyIndexes: [1],
                        data: {
                            type: "Buffer",
                            data: [1, 2, 3]
                        }
                    }
                ],
                addressTableLookups: []
            }
        };

        const result = isValidVersionedTransaction(validTxn);
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
    });

    it("should reject invalid transaction structure", () => {
        const invalidTxn = {
            signatures: "not an array",
            message: {
                header: {
                    numRequiredSignatures: "not a number"
                }
            }
        };

        const result = isValidVersionedTransaction(invalidTxn);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should reject missing required fields", () => {
        const incompleteTxn = {
            signatures: [],
            message: {
                header: {
                    numRequiredSignatures: 1
                    // missing other required fields
                }
            }
        };

        const result = isValidVersionedTransaction(incompleteTxn);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });
});

describe("mapVersionedTransaction", () => {
    const sampleTransaction: VersionedTransactionType = {
        signatures: [
            { "0": 74, "1": 136, "2": 74 },
            { "0": 114, "1": 120, "2": 68 }
        ],
        message: {
            header: {
                numRequiredSignatures: 2,
                numReadonlySignedAccounts: 0,
                numReadonlyUnsignedAccounts: 3
            },
            staticAccountKeys: [
                "CFcQz7oLSE2FXPx4ckW3wyNMdw1i66PBe4wBNV9Mgnv6", // 0
                "shuvodtwMMFFB6KmqCDYaiAe1hRokCVwr4LkT1pLAL5", // 1  
                "2vsWzuPdhsRFHmi5YuApu9EhbEH8rsE4cUuUy88zVn8m", // 2
                "ComputeBudget111111111111111111111111111111",   // 3
                "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"    // 4
            ],
            recentBlockhash: "4iKkxu81uLGkPUx5LyeunTSVoTnm7QiYQQhnZ9U8oPrS",
            compiledInstructions: [
                {
                    programIdIndex: 3, // ComputeBudget
                    accountKeyIndexes: [],
                    data: {
                        type: "Buffer",
                        data: [3, 46, 230, 10, 0, 0, 0, 0, 0]
                    }
                },
                {
                    programIdIndex: 4, // Token Program
                    accountKeyIndexes: [0, 2, 1], // CFc..., 2vs..., shu...
                    data: {
                        type: "Buffer",
                        data: [216, 239, 39, 250]
                    }
                }
            ],
            addressTableLookups: []
        }
    };

    it("should correctly map account indexes to static keys", () => {
        const result = mapVersionedTransaction(sampleTransaction);

        expect(result.signatures).toEqual(sampleTransaction.signatures);
        expect(result.message.header).toEqual(sampleTransaction.message.header);
        expect(result.message.staticAccountKeys).toEqual(sampleTransaction.message.staticAccountKeys);
        expect(result.message.recentBlockhash).toEqual(sampleTransaction.message.recentBlockhash);
        expect(result.message.addressTableLookups).toEqual(sampleTransaction.message.addressTableLookups);

        // Check the mapped instructions
        expect(result.message.instructions).toHaveLength(2);

        // First instruction
        expect(result.message.instructions[0]).toEqual({
            programId: "ComputeBudget111111111111111111111111111111",
            accountKeys: [],
            data: {
                type: "Buffer",
                data: [3, 46, 230, 10, 0, 0, 0, 0, 0]
            }
        });

        // Second instruction
        expect(result.message.instructions[1]).toEqual({
            programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
            accountKeys: [
                "CFcQz7oLSE2FXPx4ckW3wyNMdw1i66PBe4wBNV9Mgnv6",
                "2vsWzuPdhsRFHmi5YuApu9EhbEH8rsE4cUuUy88zVn8m", 
                "shuvodtwMMFFB6KmqCDYaiAe1hRokCVwr4LkT1pLAL5"
            ],
            data: {
                type: "Buffer",
                data: [216, 239, 39, 250]
            }
        });
    });

    it("should handle out-of-bounds account indexes gracefully", () => {
        const txnWithInvalidIndexes: VersionedTransactionType = {
            ...sampleTransaction,
            message: {
                ...sampleTransaction.message,
                compiledInstructions: [
                    {
                        programIdIndex: 99, // Out of bounds
                        accountKeyIndexes: [0, 88, 2], // 88 is out of bounds
                        data: {
                            type: "Buffer",
                            data: [1, 2, 3]
                        }
                    }
                ]
            }
        };

        const result = mapVersionedTransaction(txnWithInvalidIndexes);

        expect(result.message.instructions[0]).toEqual({
            programId: "Unknown(99)",
            accountKeys: [
                "CFcQz7oLSE2FXPx4ckW3wyNMdw1i66PBe4wBNV9Mgnv6",
                "Unknown(88)",
                "2vsWzuPdhsRFHmi5YuApu9EhbEH8rsE4cUuUy88zVn8m"
            ],
            data: {
                type: "Buffer",
                data: [1, 2, 3]
            }
        });
    });

    it("should handle empty instructions array", () => {
        const txnWithNoInstructions: VersionedTransactionType = {
            ...sampleTransaction,
            message: {
                ...sampleTransaction.message,
                compiledInstructions: []
            }
        };

        const result = mapVersionedTransaction(txnWithNoInstructions);

        expect(result.message.instructions).toEqual([]);
    });

    it("should preserve original data structures", () => {
        const result = mapVersionedTransaction(sampleTransaction);

        // Ensure original transaction is not mutated
        expect(sampleTransaction.message.compiledInstructions).toHaveLength(2);
        expect(sampleTransaction.message.compiledInstructions[0].programIdIndex).toBe(3);

        // Ensure mapped version has the instructions field with readable data
        expect(result.message.instructions).toBeDefined();
        expect(result.message.instructions).toHaveLength(2);
        expect(typeof result.message.instructions[0].programId).toBe('string');
        expect(Array.isArray(result.message.instructions[0].accountKeys)).toBe(true);
    });
});
