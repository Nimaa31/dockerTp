import { createContext, useContext } from 'react';
import { TaskServiceAxios } from '../services/TaskServiceAxios';

export const TaskServiceContext = createContext(); 

export function TaskServiceProvider({ children }) {
  const service = new TaskServiceAxios();
  return (
    <TaskServiceContext.Provider value={service}>
      {children}
    </TaskServiceContext.Provider>
  );
}

export function useTaskService() {
  return useContext(TaskServiceContext);
}
