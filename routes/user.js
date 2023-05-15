'use strict';

var express = require('express');
var UserController = require("../controllers/user");

const checkAuth = require("../middleware/check-auth");
const checkAuthEmployee = require("../middleware/check-auth-employee");

var router = express.Router();

router.post('/register', UserController.signup);
router.post('/login', UserController.login);
router.post('/client', checkAuth, UserController.client);
router.get('/client/:id', checkAuthEmployee, UserController.getFiveClients);
router.put('/client',checkAuth, UserController.updateClient);
router.get('/me', checkAuth, UserController.me);

router.post('/employee', checkAuthEmployee, UserController.createEmployee);
router.put('/employee', checkAuthEmployee, UserController.updateEmployee);

module.exports = router;