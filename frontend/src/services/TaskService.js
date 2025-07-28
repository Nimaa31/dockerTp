// Définition de l'URL de l'API à utiliser pour les appels réseau.
// Ici, on suppose que le service backend s'appelle "api" (via Docker) et écoute sur le port 3000.
const API_URL = 'http://api:3000/tasks';

// Fonction pour récupérer toutes les tâches depuis l'API
const getTasks = async () => {
  const res = await fetch(API_URL); // Appel GET vers /tasks
  return res.json(); // On transforme la réponse en JSON
};

// Fonction pour ajouter une nouvelle tâche
const addTask = async (task) => {
  await fetch(API_URL, {
    method: 'POST', // On utilise POST pour créer une ressource
    headers: { 'Content-Type': 'application/json' }, // On envoie du JSON
    body: JSON.stringify(task), // On transforme la tâche en chaîne JSON
  });
};

// Fonction pour mettre à jour une tâche existante
const updateTask = async (task) => {
  await fetch(`${API_URL}/${task.id}`, {
    method: 'PUT', // PUT pour remplacer la ressource existante
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
};

// Fonction pour supprimer une tâche
const deleteTask = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE', // On utilise DELETE pour supprimer
  });
};

// Export de toutes les fonctions sous forme d’un objet
export default { getTasks, addTask, updateTask, deleteTask };
