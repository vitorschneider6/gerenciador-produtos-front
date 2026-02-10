import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice";
import materialsReducer from "./materialsSlice";
import productionReducer from "./productionSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    materials: materialsReducer,
    production: productionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
