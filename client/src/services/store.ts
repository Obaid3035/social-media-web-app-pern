import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './slices/notification';

export const store = configureStore({
   reducer: {
      notification: notificationReducer
   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false
   }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
