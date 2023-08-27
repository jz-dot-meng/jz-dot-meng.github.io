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
