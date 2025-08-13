import { Value } from "@sinclair/typebox/value";
import {
    type MappedTransaction as MappedTransactionType,
    VersionedTransaction,
    type VersionedTransaction as VersionedTransactionType,
} from "@utils/types/solana";

/**
 * Validates if the given object is a valid versioned transaction using TypeBox
 */
export const isValidVersionedTransaction = (obj: unknown): { isValid: boolean; errors: string[] } => {
    const isValid = Value.Check(VersionedTransaction, obj);
    if (!isValid) {
        const errors = [...Value.Errors(VersionedTransaction, obj)];
        const errorMessages = errors.map(error => `${error.path}: ${error.message}`);
        return { isValid: false, errors: errorMessages };
    }
    return { isValid: true, errors: [] };
};

/**
 * Maps account indexes in compiled instructions to their corresponding static account keys
 * This makes the transaction much more readable by replacing numeric indexes with actual addresses
 */
export const mapVersionedTransaction = (txn: VersionedTransactionType): MappedTransactionType => {
    const mappedInstructions = txn.message.compiledInstructions.map((instruction) => {
        // Map programIdIndex to actual program ID
        const programId = txn.message.staticAccountKeys[instruction.programIdIndex] || `Unknown(${instruction.programIdIndex})`;
        
        // Map each accountKeyIndex to actual account key
        const accountKeys = instruction.accountKeyIndexes.map((index) => 
            txn.message.staticAccountKeys[index] || `Unknown(${index})`
        );

        return {
            programId,
            accountKeys,
            data: instruction.data
        };
    });

    return {
        signatures: txn.signatures,
        message: {
            header: txn.message.header,
            staticAccountKeys: txn.message.staticAccountKeys,
            recentBlockhash: txn.message.recentBlockhash,
            instructions: mappedInstructions,
            addressTableLookups: txn.message.addressTableLookups
        }
    };
};
