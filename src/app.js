const express = require('express');

// just run the file and connect to our DB
require('./db/mongoose');

const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');

const app = express();

// expose public folder
app.use(express.static(__dirname + "/public"));

// parse incoming JSON
app.use(express.json());

// define app routes
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('', indexRoutes);

module.exports = app;
