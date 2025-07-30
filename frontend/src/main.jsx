import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { TaskServiceProvider } from './context/TaskServiceContext';


const root = createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <TaskServiceProvider>
      <App />
    </TaskServiceProvider>
  </BrowserRouter>
);
