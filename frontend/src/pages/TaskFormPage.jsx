import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTaskService } from '../context/TaskServiceContext';

export default function TaskFormPage() {
  // État local représentant une tâche (nouvelle ou existante)
  const [task, setTask] = useState({ title: '', description: '', completed: false });

  // Récupère l'ID de la tâche depuis l'URL (utilisé en mode édition)
  const { id } = useParams();

  // Pour naviguer vers une autre page
  const navigate = useNavigate();

  // Récupère le service de gestion des tâches depuis le contexte
  const taskService = useTaskService();

  // Chargement initial de la tâche si on est en mode "édition"
  useEffect(() => {
    if (id) {
      taskService.getTask(id).then((data) => {
        if (data) {
          setTask(data); // Remplit le formulaire avec les données existantes
        } else {
          navigate('/'); // Redirige si l'ID n'est pas trouvé
        }
      });
    }
  }, [id]);

  // Gestion des changements dans les inputs (champ texte, textarea, checkbox)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setTask((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value, // Gère le cas particulier des cases à cocher
    }));
  };

  // Soumission du formulaire (création ou modification)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    if (task.title.trim() === '') return; // Empêche l'envoi si le titre est vide

    try {
      if (id) {
        await taskService.updateTask(id, task); // Si ID présent, on met à jour
      } else {
        await taskService.addTask(task); // Sinon, on ajoute une nouvelle tâche
      }
      navigate('/'); // Retour à la liste des tâches
    } catch (err) {
      console.error('Erreur lors de l’envoi du formulaire', err);
    }
  };

  // --- UI ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-800 to-pink-700 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-xl space-y-6 text-gray-800"
      >
        <h2 className="text-2xl font-bold text-center">
          {id ? 'Modifier la tâche' : 'Ajouter une nouvelle tâche'}
        </h2>

        {/* Champ titre */}
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          placeholder="Titre"
          className="w-full p-3 rounded bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />

        {/* Champ description */}
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-3 rounded bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Case à cocher */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="completed"
            checked={task.completed}
            onChange={handleChange}
            className="form-checkbox h-4 w-4 text-purple-600"
          />
          Tâche complétée
        </label>

        {/* Boutons d'action */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Valider
          </button>
        </div>
      </form>
    </div>
  );
}
