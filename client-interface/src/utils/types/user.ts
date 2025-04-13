import type { UserRemoteInfo } from "data-cache";
import { SuccessResponse } from "./api";

/* -------------------------------------------------------------------------- */
/*                               HTTP RESPONSES                               */
/* -------------------------------------------------------------------------- */

export interface UserRemoteInfoReponse extends SuccessResponse {
    success: true;
    data: UserRemoteInfo;
}
