'use strict';

var express = require('express');
var ProjectController = require("../controllers/project");

const checkAuth = require("../middleware/check-auth");
const checkAuthEmployee = require("../middleware/check-auth-employee");

var router = express.Router();

router.post('', checkAuthEmployee, ProjectController.create);
router.put('/:id', checkAuth, ProjectController.edit);
router.get('', checkAuth, ProjectController.getAll);
router.get('/getfive/:id', checkAuthEmployee, ProjectController.getFive)
router.get('/:id', checkAuth, ProjectController.getOne);

router.get('/published/all', ProjectController.getPublished)

module.exports = router;