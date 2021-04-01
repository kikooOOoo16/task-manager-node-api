const express = require('express');

// just run the file and connect to our DB
require('./db/mongoose');

const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');

const app = express();

// parse incoming JSON
app.use(express.json());

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

module.exports = app;
