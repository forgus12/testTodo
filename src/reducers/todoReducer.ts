import {createReducer} from '@reduxjs/toolkit';
import {
  addTask,
  toggleTask,
  deleteTask,
  editTask,
  setFilter,
} from '../actions/todoActions';
import {Task, Filter} from '../types';

const initialState: {tasks: Task[]; filter: Filter} = {
  tasks: [],
  filter: 'all',
};

const todoReducer = createReducer(initialState, builder => {
  builder
    .addCase(addTask, (state, action) => {
      state.tasks.push(action.payload);
    })
    .addCase(toggleTask, (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload);
      state.tasks[index].completed = !state.tasks[index].completed;
    })
    .addCase(deleteTask, (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    })
    .addCase(editTask, (state, action) => {
      const index = state.tasks.findIndex(
        task => task.id === action.payload.id,
      );
      state.tasks[index] = action.payload;
    })
    .addCase(setFilter, (state, action) => {
      state.filter = action.payload;
    });
});

export default todoReducer;
