import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import contentReducer from './slices/contentSlice'
import profileReducer from './slices/profileSlice'
import interestsReducer from './slices/interestsSlice'
import accountReducer from './slices/accountSlice'
import playbackReducer from './slices/playbackSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    content: contentReducer,
    profiles: profileReducer,
    interests: interestsReducer,
    account: accountReducer,
    playback: playbackReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
