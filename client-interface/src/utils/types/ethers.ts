import { SuccessResponse } from "./api";

export module DefiLlama {
    export interface NearestBlock {
        height: number;
        timestamp: number;
    }
}

export interface NearestBlockResponse extends SuccessResponse {
    success: true;
    data: DefiLlama.NearestBlock;
}

export interface BlockTimestampResponse extends SuccessResponse {
    success: true;
    data: {
        blockTimestamp: number;
    };
}

// https://github.com/ethereum/ercs/blob/master/ERCS/erc-4361.md
export interface SignBody {
    expiration_time: Date;
    issued_at: Date;
    not_before?: Date;
    statement?: string;
    nonce?: number;
    request_id?: string;
    domain?: string;
    uri?: string;
    chain_id?: number;
}
