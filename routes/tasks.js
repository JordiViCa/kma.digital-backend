'use strict';

var express = require('express');
var TasksController = require("../controllers/tasks");

const checkAuth = require("../middleware/check-auth");
const checkAuthEmployee = require("../middleware/check-auth-employee");

var router = express.Router();

router.post('/task', checkAuthEmployee, TasksController.createTask);
router.get('/tasks', checkAuthEmployee, TasksController.getAllTasksE);
router.get('/task', checkAuthEmployee, TasksController.getOneTaskE);
router.put('/task', checkAuthEmployee, TasksController.editTask);
router.delete('/task', checkAuthEmployee, TasksController.deleteTask);

router.get('/ctasks', checkAuth, TasksController.getAllTasks);
router.get('/ctask', checkAuth, TasksController.getOneTask);
router.post('/ctask', checkAuth, TasksController.createTaskError)
router.put('/ctask', checkAuth, TasksController.editTaskError)

router.post('/category', checkAuthEmployee, TasksController.createCategory);
router.get('/category', checkAuthEmployee, TasksController.getAllCategories);
router.put('/category', checkAuthEmployee, TasksController.editCategory);
router.delete('/category', checkAuthEmployee, TasksController.deleteCategory);

router.post('/track', checkAuthEmployee, TasksController.startTracking);
router.put('/track', checkAuthEmployee, TasksController.endTracking);
router.delete('/track', checkAuthEmployee, TasksController.deleteTracking);

module.exports = router;