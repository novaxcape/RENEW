// redux/store.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authReducer from "./authSlice";
import apiReducer from "./apiSlice";

const customStorage = {
  getItem: (key) => {
    try {
      const value = localStorage.getItem(key);
      return Promise.resolve(value);
    } catch (err) {
      console.error("Storage getItem error:", err);
      return Promise.resolve(null);
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch (err) {
      console.error("Storage setItem error:", err);
      return Promise.resolve();
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch (err) {
      console.error("Storage removeItem error:", err);
      return Promise.resolve();
    }
  },
};

const persistConfig = {
  key: "root",
  storage: customStorage,
  whitelist: ["auth"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Combine all slice reducers as normal
const appReducer = combineReducers({
  auth: persistedAuthReducer,
  api: apiReducer,
});

// Root reducer wraps appReducer so we can wipe the whole store on logout
const rootReducer = (state, action) => {
  if (action.type === "auth/logout" || action.type === "auth/vendorLogout") {
    // Preserve redux-persist's internal bookkeeping key so it doesn't break,
    // but reset every other slice back to its own initialState
    state = {
      auth: state?.auth?._persist
        ? { _persist: state.auth._persist }
        : undefined,
    };
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: ["register", "rehydrate"],
        ignoredPaths: ["auth.loading", "auth.error"],
      },
    }),
});

export const persistor = persistStore(store);