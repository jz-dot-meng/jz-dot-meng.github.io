import { Static, Type } from "@sinclair/typebox";
import { SuccessResponse } from "./api";

export const Chain = Type.Enum({ EVM: "evm", SVM: "svm" });
export type Chain = Static<typeof Chain>;

export const UserLocalInfo = Type.Object({
    privateKeyType: Chain,
    privateKey: Type.String(),
});
export type UserLocalInfo = Static<typeof UserLocalInfo>;

export const UserRemoteInfo = Type.Object({
    name: Type.Optional(Type.String()),
    pfp: Type.Optional(Type.String()),
});
export type UserRemoteInfo = Static<typeof UserRemoteInfo>;

export const User = Type.Intersect([UserLocalInfo, UserRemoteInfo]);

export type User = Static<typeof User>;

/* -------------------------------------------------------------------------- */
/*                               HTTP RESPONSES                               */
/* -------------------------------------------------------------------------- */

export interface UserRemoteInfoReponse extends SuccessResponse {
    success: true;
    data: UserRemoteInfo;
}
