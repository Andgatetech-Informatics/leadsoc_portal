import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSclice';

export default configureStore({
  reducer: {
    user: userReducer,
  },
});
