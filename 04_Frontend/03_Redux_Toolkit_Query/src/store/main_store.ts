import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from "./all_items";

const mainStore = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
});

export default mainStore;
