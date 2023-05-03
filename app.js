'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var cors = require('cors')

var app = express();

// Carregar rutes
var user_routes = require('./routes/user');
var chat_routes = require('./routes/chat');
var project_routes = require('./routes/project');
var tasks_routes = require('./routes/tasks');
// Middleware
// Codifiquem a json tot el que en arriba
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// CORS
app.use(cors())
 
// Rutes
app.use('/api/auth',user_routes);
app.use('/api/client',chat_routes);
app.use('/api/projects',project_routes);
app.use('/api/projects',tasks_routes)

// Exportar
module.exports=app;