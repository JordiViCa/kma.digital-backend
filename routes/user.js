'use strict';

var express = require('express');
var UserController = require("../controllers/user");

const checkAuth = require("../middleware/check-auth");

var router = express.Router();

router.post('/register', UserController.signup);
router.post('/login', UserController.login);
router.post('/client', checkAuth, UserController.client);
router.post('/client/update',checkAuth, UserController.updateClient)
router.get('/me', checkAuth, UserController.me);

module.exports = router;