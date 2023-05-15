'use strict';

var express = require('express');
var ContactController = require("../controllers/contact");

const checkAuth = require("../middleware/check-auth");
const checkAuthEmployee = require("../middleware/check-auth-employee");

var router = express.Router();

router.post('', ContactController.create);
router.get('', checkAuthEmployee, ContactController.getAll);

module.exports = router;