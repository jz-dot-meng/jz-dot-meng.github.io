import { combineReducers } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage'
import { persistReducer } from "redux-persist";
import { etfOverlapReducer } from "./etfOverlapReducers";

const etfOverlapPersitsConfig = {
    key: 'etfOverlap',
    storage: storage
}

export const equitiesRootReducer = combineReducers({
    etfOverlap: persistReducer(etfOverlapPersitsConfig, etfOverlapReducer)
})