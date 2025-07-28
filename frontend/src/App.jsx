import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskListPage from './pages/TaskListPage';
import TaskFormPage from './pages/TaskFormPage';
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<TaskListPage />} />
      <Route path="/add" element={<TaskFormPage />} />
      <Route path="/edit/:id" element={<TaskFormPage />} />
    </Routes>
  );
}

export default App
