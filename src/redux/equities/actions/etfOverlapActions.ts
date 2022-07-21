import { createAction } from "@reduxjs/toolkit";

import * as types from '../../../constants'

export type TickerWeightingPayload = {
    [ticker: string]: number
}

export type TickerHoldingPayload = {
    [ticker: string]: {
        assetClass: string,
        country: string,
        currency: string,
        marketValAud: string,
        name: string,
        notionalValAud: string,
        sector: string,
        sedol: string,
        ticker: string,
        units: string,
        weight: string
    }[]
}

export type EtfTickerWeighting = {
    [ticker: string]: number
}

// cash holdings don't have a sedol, so don't want to use it as unique identifier, 
// however betashares displays stock tickers with their exchange code ie 'APPL UW'
export type TickerOverlapPayload = {
    [ticker: string]: {
        sedol: string,
        name: string,
        etfs: EtfTickerWeighting
    }
}

export const subtractFromRemainingPortfolioWeight = createAction<number>(types.SUBTRACT_FROM_REMAINING_PORTFOLIO_WEIGHT)
export const addToRemainingPortfolioWeight = createAction<number>(types.ADD_TO_REMAINING_PORTFOLIO_WEIGHT)
export const addEtfToPortfolio = createAction<TickerWeightingPayload>(types.ADD_ETF_TO_PORTFOLIO)
export const removeEtfFromPortfolio = createAction<string>(types.REMOVE_ETF_FROM_PORTFOLIO)
export const setStockOverlap = createAction<TickerOverlapPayload>(types.SET_STOCK_OVERLAP)
export const addEtfHoldings = createAction<TickerHoldingPayload>(types.ADD_ETF_HOLDINGS)