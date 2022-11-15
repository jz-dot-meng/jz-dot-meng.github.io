

import { configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import { equitiesRootReducer } from "../equities/reducers";
import { cryptoRootReducer } from "../wallet/reducers";

export const store = configureStore({
    reducer: {
        crypto: cryptoRootReducer,
        equities: equitiesRootReducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),

})
export type ReduxRootState = ReturnType<typeof store.getState>

export const persistor = persistStore(store)