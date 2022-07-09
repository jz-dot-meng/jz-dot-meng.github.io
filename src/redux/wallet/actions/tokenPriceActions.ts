import { createAction } from "@reduxjs/toolkit";

import * as types from '../../../constants'

/*
  historic : {
    polkadot : {
        currency: 'aud',
        data: {
            [date]: [price],
            [date]: [price]
        }
    }
 },
 current:{
    polkadot:{
        currency: 'aud',
        [ticker]:[price]
    }
 }
*/

export type HistoricPricePayload = {
    [token: string]: HistoricPriceTokenPayload
}
export type HistoricPriceTokenPayload = {
    currency: string,
    data: HistoricPriceDataPayload
}
export type HistoricPriceDataPayload = {
    [date: string]: number;
}

export type CurrentPricePayload = {
    [token: string]: CurrentPricePayload
}
export type CurrentPriceTokenPayload = {
    currency: string,
    data: CurrentPriceDataPayload
}
export type CurrentPriceDataPayload = {
    [ticker: string]: number
}

export const addHistoricPrices = createAction<{
    token: string, currency: string, data: any
}>(types.ADD_HISTORIC_PRICES);

export const addCurrentPrice = createAction<{
    tokenName: string, currency: string, data: { [ticker: string]: number }
}>(types.ADD_CURRENT_PRICE)