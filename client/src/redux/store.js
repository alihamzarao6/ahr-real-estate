import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./user/userSlice.js"; // we are exporting userSlice.reducer as default and importing here as 'userReducer'

// combining all reducers in rootReducer variable
const rootReducer = combineReducers({ user: userReducer });

// redux persist config
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

// make reducers persisted. This 'persistReducer' is specifically used here to get control over which reducer/state we wanted to be persisted
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


// Create a persistor object to manage the persisting(saving data in any storage) and rehydration(bringing data to redux after refreshing or reopening the website) processes. This ensures that the Redux state is saved to storage and reloaded when the app is reopened. 'persistStore' returns this persistor object
export const persistor = persistStore(store);


/*  persistStore provides a straightforward way to persist the entire store, using persistReducer alongside it gives you more control and customization options for a more tailored and efficient state persistence strategy. If you are using persistStore directly on the store, you are indeed persisting the entire store. The use of persistReducer provides additional control and flexibility in deciding which parts of your Redux state should be persisted */