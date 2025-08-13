import { type Static, Type } from "@sinclair/typebox";

// Define the signature schema (key-value pairs where key is string number and value is number)
export const Signature = Type.Record(Type.String(), Type.Number());
export type Signature = Static<typeof Signature>;

// Define the instruction data schema
export const InstructionData = Type.Object({
    type: Type.String(),
    data: Type.Array(Type.Number()),
});
export type InstructionData = Static<typeof InstructionData>;

// Define the compiled instruction schema
export const CompiledInstruction = Type.Object({
    programIdIndex: Type.Number(),
    accountKeyIndexes: Type.Array(Type.Number()),
    data: InstructionData,
});
export type CompiledInstruction = Static<typeof CompiledInstruction>;

// Define the message header schema
export const MessageHeader = Type.Object({
    numRequiredSignatures: Type.Number(),
    numReadonlySignedAccounts: Type.Number(),
    numReadonlyUnsignedAccounts: Type.Number(),
});
export type MessageHeader = Static<typeof MessageHeader>;

// Define the message schema for input versioned transaction
export const VersionedTransactionMessage = Type.Object({
    header: MessageHeader,
    staticAccountKeys: Type.Array(Type.String()),
    recentBlockhash: Type.String(),
    compiledInstructions: Type.Array(CompiledInstruction),
    addressTableLookups: Type.Array(Type.Unknown()),
});
export type VersionedTransactionMessage = Static<typeof VersionedTransactionMessage>;

// Define the input versioned transaction schema
export const VersionedTransaction = Type.Object({
    signatures: Type.Array(Signature),
    message: VersionedTransactionMessage,
});
export type VersionedTransaction = Static<typeof VersionedTransaction>;

// Define the mapped instruction schema for output
export const MappedInstruction = Type.Object({
    programId: Type.String(),
    accountKeys: Type.Array(Type.String()),
    data: InstructionData,
});
export type MappedInstruction = Static<typeof MappedInstruction>;

// Define the mapped message schema for output
export const MappedTransactionMessage = Type.Object({
    header: MessageHeader,
    staticAccountKeys: Type.Array(Type.String()),
    recentBlockhash: Type.String(),
    instructions: Type.Array(MappedInstruction),
    addressTableLookups: Type.Array(Type.Unknown()),
});
export type MappedTransactionMessage = Static<typeof MappedTransactionMessage>;

// Define the output mapped transaction schema
export const MappedTransaction = Type.Object({
    signatures: Type.Array(Signature),
    message: MappedTransactionMessage,
});
export type MappedTransaction = Static<typeof MappedTransaction>;
