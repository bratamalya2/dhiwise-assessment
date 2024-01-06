import { configureStore } from '@reduxjs/toolkit';

import nodeSliceReducer from './nodeSlice';

const store = configureStore({
  reducer: {
    node: nodeSliceReducer,
  },
});

export type AppDispatchType = typeof store.dispatch;
export type RootStateType = ReturnType<typeof store.getState>;
export default store;
