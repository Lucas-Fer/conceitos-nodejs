const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.body;

  const findUser = users.find(user => user.username === username);

  if (findUser) return response.status(400).json({ error: 'Username already in use' });

  next();
}

function findUser(request, response, next) {
  const { username } = request.headers;

  if (!username) return response.status(404).send({ error: 'Header required!' });

  const findUser = users.find(user => user.username === username);

  if (!findUser) return response.status(400).json({ error: 'Username not found' });

  request.user = findUser;
  next();
}

function verifyPostTodo(request, response, next) {
  const { title, deadline } = request.body;

  if (!title || !deadline) return response.status(400).json({ error: 'Fields title/deadline requisred!' });

  next();
}

function verifyUuidTodo(request, response, next) {
  const { id } = request.params;
  const { user } = request;

  const findTask = user.todos.find((task) => task.id === id);

  if (!findTask) return response.status(404).json({ error: 'Task not found!' });

  request.task = findTask;
  next();
}

app.post('/users', checksExistsUserAccount, (request, response) => {
  const { name, username } = request.body;

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  }

  users.push(newUser);

  return response.status(201).json(newUser);
});

app.get('/todos', findUser, (request, response) => {
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post('/todos', findUser, verifyPostTodo, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const newTask = {
    id: uuidv4(),
    title,
    deadline,
    done: false,
    created_at: new Date(),
  }

  user.todos.push(newTask);

  return response.status(201).json(newTask);
});

app.put('/todos/:id', findUser, verifyPostTodo, verifyUuidTodo, (request, response) => {
  const { title, deadline } = request.body;
  const { task } = request;

  task.title = title;
  task.deadline = deadline;

  return response.status(200).json(task);
});

app.patch('/todos/:id/done', findUser, verifyUuidTodo, (request, response) => {
  const { task } = request;

  task.done = true;

  return response.status(200).json(task);
});

app.delete('/todos/:id', findUser, verifyUuidTodo, (request, response) => {
  const { task, user } = request;

  user.todos.splice(task, 1);

  return response.status(204).json(user)
});

module.exports = app;