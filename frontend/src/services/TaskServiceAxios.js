import axios from 'axios';

// Définition d'une classe pour encapsuler toutes les opérations liées aux tâches via axios
export class TaskServiceAxios {
  // Récupération de l'URL de base à partir des variables d’environnement Vite
  baseUrl = import.meta.env.VITE_API_URL;

  // Récupère toutes les tâches depuis l'API
  async getTasks() {
    const res = await axios.get(`${this.baseUrl}/tasks`);
    return res.data; // axios met déjà les données JSON dans res.data
  }

  // Récupère une tâche spécifique par son ID
  async getTask(id) {
    // Remarque : ici tu récupères **toutes les tâches** puis tu filtres localement
    // Cela fonctionne, mais n’est pas optimal s’il y a une route GET /tasks/:id sur ton API
    const res = await axios.get(`${this.baseUrl}/tasks`);
    return res.data.find(t => t.id === Number(id));
  }

  // Ajoute une nouvelle tâche
  async addTask(task) {
    await axios.post(`${this.baseUrl}/tasks`, task);
    // Pas besoin de gérer headers, axios utilise application/json par défaut
  }

  // Met à jour une tâche existante
  async updateTask(id, task) {
    await axios.put(`${this.baseUrl}/tasks/${id}`, task);
  }

  // Supprime une tâche par son ID
  async deleteTask(id) {
    await axios.delete(`${this.baseUrl}/tasks/${id}`);
  }
}
