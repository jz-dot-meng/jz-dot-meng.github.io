import { Static, Type } from "@sinclair/typebox";

export const Chain = Type.Enum({ EVM: "evm", SVM: "svm" });
export type Chain = Static<typeof Chain>;

export const UserLocalInfo = Type.Object({
    privateKeyType: Chain,
    privateKey: Type.String(),
});
export type UserLocalInfo = Static<typeof UserLocalInfo>;

export const UserRemoteInfo = Type.Object({
    displayName: Type.Optional(Type.String()),
    pfpUrl: Type.Optional(Type.String()),
});
export type UserRemoteInfo = Static<typeof UserRemoteInfo>;

export const User = Type.Intersect([UserLocalInfo, UserRemoteInfo]);

export type User = Static<typeof User>;
