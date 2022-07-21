import { createReducer } from "@reduxjs/toolkit";
import { addEtfHoldings, addEtfToPortfolio, removeEtfFromPortfolio, setStockOverlap, subtractFromRemainingPortfolioWeight, TickerHoldingPayload, TickerOverlapPayload, TickerWeightingPayload } from "../actions/etfOverlapActions";

interface EtfOverlapState {
    remainingPortfolioWeight: number;
    portfolio: TickerWeightingPayload;
    etfHoldings: TickerHoldingPayload;
    overlap: TickerOverlapPayload
}

const initialState: EtfOverlapState = {
    remainingPortfolioWeight: 100,
    portfolio: {},
    etfHoldings: {},
    overlap: {}
}

export const etfOverlapReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(
            subtractFromRemainingPortfolioWeight, (state, action) => {
                state.remainingPortfolioWeight -= action.payload
            }
        )
        .addCase(
            addEtfToPortfolio, (state, action) => {
                state.portfolio = Object.assign(state.portfolio, action.payload)
            }
        )
        .addCase(
            addEtfHoldings, (state, action) => {
                state.etfHoldings = Object.assign(state.etfHoldings, action.payload)
            }
        )
        .addCase(
            removeEtfFromPortfolio, (state, action) => {
                delete state.etfHoldings[action.payload]
                state.remainingPortfolioWeight += state.portfolio[action.payload]
                delete state.portfolio[action.payload]
            }
        )
        .addCase(
            setStockOverlap, (state, action) => {
                state.overlap = action.payload
            }
        )
})