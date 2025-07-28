import { useEffect, useState } from 'react';
import { useTaskService } from '../context/TaskServiceContext';
import { useNavigate } from 'react-router-dom';

export default function TaskListPage() {
  // État local pour stocker la liste des tâches
  const [tasks, setTasks] = useState([]);

  // On récupère le service de tâches depuis le contexte
  const taskService = useTaskService();

  // Hook pour rediriger vers d'autres pages
  const navigate = useNavigate();

  // Chargement initial des tâches à l'affichage du composant
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fonction qui récupère les tâches depuis l'API
  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasks(); // Appel à l'API
      setTasks(data); // Mise à jour du state
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches', error);
    }
  };

  // Fonction de suppression d'une tâche
  const handleDelete = async (id) => {
    try {
      await taskService.deleteTask(id); // Supprime la tâche via l'API
      fetchTasks(); // Recharge la liste après suppression
    } catch (error) {
      console.error('Erreur lors de la suppression', error);
    }
  };

  // --- Rendu HTML ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-800 to-pink-700 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Titre principal */}
        <h1 className="text-4xl font-bold text-center mb-8">Ma To-Do Liste</h1>

        {/* Bouton pour ajouter une nouvelle tâche */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              console.log('Navigating to /add');
              navigate('/add'); // Redirection vers la page de création
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            ➕ Ajouter une Tâche
          </button>
        </div>

        {/* Affichage si aucune tâche n'existe */}
        {tasks.length === 0 ? (
          <p className="text-center">Aucune tâche pour le moment.</p>
        ) : (
          // Liste des tâches
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="bg-white text-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between">
                  {/* Infos de la tâche */}
                  <div>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      {/* Indique si la tâche est complétée */}
                      {task.completed && <span>🟢</span>}
                      {task.title}
                    </h2>
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </div>

                  {/* Boutons action : modifier & supprimer */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/edit/${task.id}`)} // Redirige vers la page d'édition
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)} // Supprime la tâche
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
