import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

import { addressReducer } from './addressReducers'
import { currencyReducer } from "./currencyReducer";
import { tokenPriceReducer } from "./tokenPriceReducers";

const addressPersistConfig = {
    key: 'address',
    storage: storage
}
const currencyPersistConfig = {
    key: 'currency',
    storage: storage
}
const tokenPricePersistConfig = {
    key: 'token',
    storage: storage
}

export const cryptoRootReducer = combineReducers({
    addressTracker: persistReducer(addressPersistConfig, addressReducer),
    currencyCoversion: persistReducer(currencyPersistConfig, currencyReducer),
    tokenPrice: persistReducer(tokenPricePersistConfig, tokenPriceReducer)
})