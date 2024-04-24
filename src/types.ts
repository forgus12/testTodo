// types.ts
export type Task = {
  id: string;
  text: string;
  completed: boolean;
};

export type Filter = 'all' | 'completed' | 'uncompleted';
