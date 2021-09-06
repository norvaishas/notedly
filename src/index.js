const express = require('express');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();

// Импортируем локальные модули
const db = require('./db');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// Запускаем сервер на порте, указанном в файле .env, или на порте 4000
const port = process.env.PORT || 4000;

// Сохраняем значение DB_HOST в виде переменной
const DB_HOST = process.env.DB_HOST;

const app = express();

// Подключаем БД
db.connect(DB_HOST);

// Настройка Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Применяем промежуточное ПО Apollo GraphQL и указываем путь к /api
server.applyMiddleware({ app, path: '/api'});

app.get('/', (req, res) => res.send('Hello Mobile!'));
app.listen(port, () => console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`));
