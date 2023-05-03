'use strict';

var express = require('express');
var ProjectController = require("../controllers/project");

const checkAuth = require("../middleware/check-auth");
const checkAuthEmployee = require("../middleware/check-auth-employee");

var router = express.Router();

router.post('/new', checkAuthEmployee, ProjectController.create);
router.post('/edit', checkAuth, ProjectController.edit);
router.get('/get', checkAuth, ProjectController.getAll);
router.get('/get/:id', checkAuth, ProjectController.getOne);

module.exports = router;