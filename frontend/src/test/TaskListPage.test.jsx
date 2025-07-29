// src/test/TaskListPage.test.jsx
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TaskListPage from '../pages/TaskListPage';
import { TaskServiceContext } from '../context/TaskServiceContext';

describe('TaskListPage', () => {
  test('affiche "Aucune tâche pour le moment" quand la liste est vide', async () => {
    const mockTaskService = {
      getTasks: async () => [],
      deleteTask: async () => {}
    };

    render(
      <TaskServiceContext.Provider value={mockTaskService}>
        <MemoryRouter>
          <TaskListPage />
        </MemoryRouter>
      </TaskServiceContext.Provider>
    );

    expect(await screen.findByText(/Aucune tâche pour le moment/i)).toBeInTheDocument();
  });
});
