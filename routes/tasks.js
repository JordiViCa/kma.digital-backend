'use strict';

var express = require('express');
var TasksController = require("../controllers/tasks");

const checkAuth = require("../middleware/check-auth");
const checkAuthEmployee = require("../middleware/check-auth-employee");

var router = express.Router();

router.post('/task', checkAuthEmployee, TasksController.createTask);
router.post('/errortask', checkAuth, TasksController.createTaskError);
router.get('/tasks/:id', checkAuth, TasksController.getAllTasks);
router.get('/task/:id', checkAuth, TasksController.getOneTask);
router.put('/task/:id', checkAuthEmployee, TasksController.editTask);
router.delete('/task/:id', checkAuthEmployee, TasksController.deleteTask);

router.post('/categories', checkAuthEmployee, TasksController.createCategory);
router.get('/categories/:id', checkAuth, TasksController.getAllCategories);
router.put('/categories/:id', checkAuthEmployee, TasksController.editCategory);
router.delete('/categories/:id', checkAuthEmployee, TasksController.deleteCategory);

router.post('/track', checkAuthEmployee, TasksController.startTracking);
router.put('/track', checkAuthEmployee, TasksController.endTracking);
router.delete('/track/:id', checkAuthEmployee, TasksController.deleteTracking);

module.exports = router;