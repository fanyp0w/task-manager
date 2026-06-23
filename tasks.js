const fs = require('fs/promises');
const path = require('path');

const DB_PATH = path.join(__dirname, 'tasks.json');

// ASYNC/AWAIT: fs.readFile возвращает Promise.
// await ждёт результат, не блокируя сервер.
const readTasks = async () => {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const writeTasks = async (tasks) => {
  await fs.writeFile(DB_PATH, JSON.stringify(tasks, null, 2), 'utf-8');
};

// ЛЯМБДЫ: стрелочные функции внутри .filter() и .sort()
const getAllTasks = async (filter = {}) => {
  const tasks = await readTasks();
  return tasks
    .filter(task => {
      if (filter.done !== undefined) return task.done === filter.done;
      if (filter.priority) return task.priority === filter.priority;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const getTaskById = async (id) => {
  const tasks = await readTasks();
  return tasks.find(task => task.id === id) ?? null;
};

const createTask = async ({ title, description = '', priority = 'medium' }) => {
  const tasks = await readTasks();
  const newTask = {
    id: Date.now().toString(),
    title, description, priority,
    done: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tasks.push(newTask);
  await writeTasks(tasks);
  return newTask;
};

// ЛЯМБДА в .map(): если id совпадает — обновляем, иначе оставляем
const updateTask = async (id, updates) => {
  const tasks = await readTasks();
  const updated = tasks.map(task =>
    task.id === id
      ? { ...task, ...updates, updatedAt: new Date().toISOString() }
      : task
  );
  const found = updated.find(task => task.id === id);
  if (!found) return null;
  await writeTasks(updated);
  return found;
};

// ЛЯМБДА в .filter(): оставляем всё кроме удаляемой задачи
const deleteTask = async (id) => {
  const tasks = await readTasks();
  const filtered = tasks.filter(task => task.id !== id);
  if (filtered.length === tasks.length) return false;
  await writeTasks(filtered);
  return true;
};

// REDUCE + ЛЯМБДА: считаем статистику за один проход
const getStats = async () => {
  const tasks = await readTasks();
  return tasks.reduce((acc, task) => {
    acc.total++;
    if (task.done) acc.done++;
    else acc.pending++;
    acc.byPriority[task.priority] = (acc.byPriority[task.priority] || 0) + 1;
    return acc;
  }, { total: 0, done: 0, pending: 0, byPriority: {} });
};

// PROMISE.ALL: создаём несколько задач параллельно, не по очереди
const seedDatabase = async () => {
  const existing = await readTasks();
  if (existing.length > 0) return;
  await Promise.all([
    createTask({ title: 'Изучить замыкания в JS', priority: 'high' }),
    createTask({ title: 'Разобраться с async/await', priority: 'high' }),
    createTask({ title: 'Сделать CRUD на Express', priority: 'medium' }),
    createTask({ title: 'Написать middleware', priority: 'medium' }),
    createTask({ title: 'Задеплоить проект', priority: 'low' })
  ]);
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask, getStats, seedDatabase };
