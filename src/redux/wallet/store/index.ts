

import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import { cryptoRootReducer } from "../reducers";

export const store = configureStore({
    reducer: { crypto: cryptoRootReducer }
})
export type ReduxRootState = ReturnType<typeof store.getState>

export const persistor = persistStore(store)