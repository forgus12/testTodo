import AsyncStorage from '@react-native-async-storage/async-storage';
import {Task} from '../types';

export const loadTasksFromStorage = async () => {
  try {
    const savedTasks = await AsyncStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const saveTaskToStorage = async (tasks: Task[]) => {
  try {
    console.log(tasks);

    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving task:', error);
  }
};

export const deleteTaskFromStorage = async (taskId: string) => {
  try {
    const existingTasks = await loadTasksFromStorage();
    const updatedTasks = existingTasks.filter(
      (task: Task) => task.id !== taskId,
    );
    await saveTaskToStorage(updatedTasks);
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};
