

import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import { equitiesRootReducer } from "../equities/reducers";
import { cryptoRootReducer } from "../wallet/reducers";

export const store = configureStore({
    reducer: {
        crypto: cryptoRootReducer,
        equities: equitiesRootReducer
    }
})
export type ReduxRootState = ReturnType<typeof store.getState>

export const persistor = persistStore(store)