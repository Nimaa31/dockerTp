const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const MAX_RETRIES = 10;
const RETRY_INTERVAL = 3000;

let db;

function connectWithRetry(retries = 0) {
  db = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: 'tododb'
  });

  db.connect((err) => {
    if (err) {
      if (retries < MAX_RETRIES) {
        console.log(`⏳ MySQL not ready. Retrying in 3s... (${retries + 1}/${MAX_RETRIES})`);
        setTimeout(() => connectWithRetry(retries + 1), RETRY_INTERVAL);
      } else {
        console.error('❌ Could not connect to MySQL after retries. Exiting.');
        process.exit(1);
      }
    } else {
      console.log('✅ Connected to MySQL');

      // Démarrage du serveur express uniquement si la DB est prête
      app.listen(3000, () => console.log('🚀 API running on port 3000'));
    }
  });
}

connectWithRetry();

// Routes CRUD
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  db.query('INSERT INTO tasks (title, description) VALUES (?, ?)', [title, description], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(201);
  });
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  db.query('UPDATE tasks SET title=?, description=?, completed=? WHERE id=?', [title, description, completed, id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id=?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});
