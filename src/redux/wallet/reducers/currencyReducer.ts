import { createReducer } from "@reduxjs/toolkit";
import { addTokenConversion, setCurrency, TokenConversionPayload } from "../actions/currencyActions";

interface CurrencyState {
    currency: string;
    tokenConversions: TokenConversionPayload[]
}

const initialState: CurrencyState = {
    currency: 'aud',
    tokenConversions: []
}

export const currencyReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(
            setCurrency, (state, action) => {
                state.currency = action.payload
            }
        )
        .addCase(
            addTokenConversion, (state, action) => {
                state.tokenConversions.push(action.payload)
            }
        )
})