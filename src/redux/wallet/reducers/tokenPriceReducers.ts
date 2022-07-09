import { createReducer } from "@reduxjs/toolkit";
import { addCurrentPrice, addHistoricPrices, HistoricPricePayload, HistoricPriceTokenPayload } from "../actions/tokenPriceActions";

interface HistoricPriceState {
    historic: HistoricPricePayload
    current: any
}

const initialState = {
    historic: {} as HistoricPricePayload,
    current: {} as any
}

export const tokenPriceReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(
            addHistoricPrices, (state, action) => {
                if (state.historic[`${action.payload.token}`] === undefined) {
                    state.historic[`${action.payload.token}`] = {} as HistoricPriceTokenPayload;
                }
                state.historic[action.payload.token].currency = action.payload.currency;
                state.historic[action.payload.token].data = {
                    ...action.payload.data
                }
            }
        )
        .addCase(
            addCurrentPrice, (state, action) => {
                if (state.current[`${action.payload.tokenName}`] === undefined) {
                    state.current[`${action.payload.tokenName}`] = {} as HistoricPriceTokenPayload;
                }
                state.current[action.payload.tokenName].currency = action.payload.currency;
                state.current[action.payload.tokenName].data = {
                    ...action.payload.data
                }
            }
        )
})