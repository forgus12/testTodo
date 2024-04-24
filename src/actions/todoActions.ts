import {createAction, PayloadAction} from '@reduxjs/toolkit';
import {Task} from '../types';

export const addTask = createAction<Task>('ADD_TASK');
export const toggleTask = createAction<string>('TOGGLE_TASK');
export const deleteTask = createAction<string>('DELETE_TASK');
export const editTask =
  createAction<PayloadAction<{id: number; text: string; completed: boolean}>>(
    'EDIT_TASK',
  );
export const setFilter = createAction<string>('SET_FILTER');
