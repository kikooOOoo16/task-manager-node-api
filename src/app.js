const express = require('express');

// just run the file and connect to our DB
require('./db/mongoose');

const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');

const app = express();

//Environment variables config
require('dotenv').config();

// parse incoming JSON
app.use(express.json());

// define app routes
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

module.exports = app;
