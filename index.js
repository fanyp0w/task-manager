const express = require('express');
const path = require('path');
const { createRateLimiter, createLogger } = require('./middleware');
const { getAllTasks, getTaskById, createTask, updateTask, deleteTask, getStats, seedDatabase } = require('./tasks');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use(createLogger('API'));
app.use('/api', createRateLimiter(30, 60_000));

app.get('/api/tasks', async (req, res) => {
  try {
    const filter = {
      done: req.query.done !== undefined ? req.query.done === 'true' : undefined,
      priority: req.query.priority
    };
    const tasks = await getAllTasks(filter);
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/tasks/stats', async (req, res) => {
  try {
    const stats = await getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Задача не найдена' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, error: 'Поле title обязательно' });
    }
    const task = await createTask({ title: title.trim(), description, priority });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const allowed = ['title', 'description', 'priority', 'done'];
    const updates = Object.keys(req.body).reduce((acc, key) => {
      if (allowed.includes(key)) acc[key] = req.body[key];
      return acc;
    }, {});
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'Нет полей для обновления' });
    }
    const task = await updateTask(req.params.id, updates);
    if (!task) return res.status(404).json({ success: false, error: 'Задача не найдена' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const deleted = await deleteTask(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Задача не найдена' });
    res.json({ success: true, message: 'Задача удалена' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const start = async () => {
  await seedDatabase();
  app.listen(PORT, () => {
    console.log(`\nСервер запущен: http://localhost:${PORT}\n`);
  });
};

start();
