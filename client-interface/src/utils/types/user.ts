import { Static, Type } from "@sinclair/typebox";

export const Chain = Type.Enum({ EVM: "evm", SVM: "svm" });
export type Chain = Static<typeof Chain>;

export const UserLocalPrivateKey = Type.Object({
    privateKeyType: Chain,
    privateKey: Type.String(),
});
export type UserLocalPrivateKey = Static<typeof UserLocalPrivateKey>;

export const UserRemoteInfo = Type.Object({
    name: Type.Optional(Type.String()),
});

export const User = Type.Intersect([UserLocalPrivateKey, UserRemoteInfo]);

export type User = Static<typeof User>;
