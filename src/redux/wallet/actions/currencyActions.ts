import { createAction } from "@reduxjs/toolkit";

import * as types from '../../../constants'

export type TokenConversionPayload = {
    fromToken: string,
    toToken: string,
    conversion: number
}

export const setCurrency = createAction<string>(types.SET_CURRENCY)
export const addTokenConversion = createAction<TokenConversionPayload>(types.ADD_TOKEN_CONVERSION)