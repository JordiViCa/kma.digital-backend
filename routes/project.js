'use strict';

var express = require('express');
var ProjectController = require("../controllers/project");

const checkAuth = require("../middleware/check-auth");

var router = express.Router();

router.post('/new', checkAuth, ProjectController.create);
router.post('/edit', checkAuth, ProjectController.edit);
router.get('/get', checkAuth, ProjectController.getAll);
router.get('/get/:id', checkAuth, ProjectController.getOne);

module.exports = router;