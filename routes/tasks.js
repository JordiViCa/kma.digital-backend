'use strict';

var express = require('express');
var TasksController = require("../controllers/tasks");

const checkAuth = require("../middleware/check-auth");
const checkAuthEmployee = require("../middleware/check-auth-employee");

var router = express.Router();

router.post('/task', checkAuthEmployee, TasksController.createTask);
router.get('/tasks/:id', checkAuthEmployee, TasksController.getAllTasksE);
router.get('/task/:id', checkAuthEmployee, TasksController.getOneTaskE);
router.put('/task/:id', checkAuthEmployee, TasksController.editTask);
router.delete('/task', checkAuthEmployee, TasksController.deleteTask);

router.get('/ctasks', checkAuth, TasksController.getAllTasks);
router.get('/ctask', checkAuth, TasksController.getOneTask);
router.post('/ctask', checkAuth, TasksController.createTaskError)
router.put('/ctask', checkAuth, TasksController.editTaskError)

router.post('/categories', checkAuthEmployee, TasksController.createCategory);
router.get('/categories/:id', checkAuthEmployee, TasksController.getAllCategories);
router.put('/categories/:id', checkAuthEmployee, TasksController.editCategory);
router.delete('/categories', checkAuthEmployee, TasksController.deleteCategory);

router.post('/track', checkAuthEmployee, TasksController.startTracking);
router.put('/track', checkAuthEmployee, TasksController.endTracking);
router.delete('/track/:id', checkAuthEmployee, TasksController.deleteTracking);

module.exports = router;