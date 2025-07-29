import { createContext, useContext } from 'react';

export const TaskServiceContext = createContext(null);

export const useTaskService = () => {
  return useContext(TaskServiceContext);
};
