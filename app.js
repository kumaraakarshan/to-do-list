const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL Configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'node-complete'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database');
});

// API endpoint to get all todos
app.get('/api/get-todos', (req, res) => {
  const sql = 'SELECT * FROM todo';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching todos: ' + err.message);
      res.status(500).json({ error: 'An error occurred while fetching todos.' });
      return;
    }

    res.json(results); // Send the retrieved todos as a JSON response
  });
});

app.put('/api/mark-done/:id', (req, res) => {
  const todoId = req.params.id;

  const sql = 'UPDATE todo SET isDone = 1 WHERE id = ?';
  db.query(sql, [todoId], (err, result) => {
    if (err) {
      console.error('Error marking task as done: ' + err.stack);
      res.status(500).json({ error: 'An error occurred while marking task as done.' });
      return;
    }

    res.json({ message: 'Task marked as done successfully.' });
  });
});

// API endpoint to save form data
app.post('/api/save-data', (req, res) => {
  const { addTodo, description } = req.body;
//console.log(addTodo);
  const sql = 'INSERT INTO todo (addTodo, description ) VALUES (?, ?)';
  db.query(sql, [addTodo, description ], (err, result) => {
    if (err) {
      console.error('Error saving data: ' + err.message);
      res.status(500).json({ error: 'An error occurred while saving data.' });
      return;
    }
    res.json({ message: 'Data saved successfully.' });
  });
});

// API endpoint to delete a todo by ID
app.delete('/api/delete-todo/:id', (req, res) => {
  const todoId = req.params.id;

  const sql = 'DELETE FROM todo WHERE id = ?';
  db.query(sql, [todoId], (err, result) => {
    if (err) {
      console.error('Error deleting todo: ' + err.message);
      res.status(500).json({ error: 'An error occurred while deleting todo.' });
      return;
    }

    res.json({ message: 'todo deleted successfully.' });
  });
});

app.listen(3000)