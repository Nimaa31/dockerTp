import { render, screen } from '@testing-library/react';
import TaskListPage from '../pages/TaskListPage';
import { TaskServiceContext } from '../context/TaskServiceContext'; // ✅ import corrigé
import { MemoryRouter } from 'react-router-dom';

test('affiche "Aucune tâche pour le moment" quand la liste est vide', () => {
  const mockTaskService = {
    getAllTasks: () => Promise.resolve([]),
  };

  render(
    <TaskServiceContext.Provider value={mockTaskService}>
      <MemoryRouter>
        <TaskListPage />
      </MemoryRouter>
    </TaskServiceContext.Provider>
  );

  // Ajoute un await si ton composant est async
  expect(screen.getByText(/Aucune tâche pour le moment/i)).toBeInTheDocument();
});
