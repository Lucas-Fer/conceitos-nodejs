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

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;