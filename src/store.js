// src/store.js
import {configureStore} from '@reduxjs/toolkit';
import todoReducer from './reducers/todoReducer';

const store = configureStore({
  reducer: {
    todo: todoReducer,
  },
});

export default store;
