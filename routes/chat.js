'use strict';

var express = require('express');
var ChatController = require("../controllers/chat");

const checkAuth = require("../middleware/check-auth");

var router = express.Router();

router.post('/newchat', checkAuth, ChatController.create);
router.post('/edit', checkAuth, ChatController.edit);
router.get('/mychats', checkAuth, ChatController.getAll);
router.get('/chat/:id', checkAuth, ChatController.getOne);
router.post('/sendmessage', checkAuth, ChatController.send);
router.post('/getmessages', checkAuth, ChatController.send);

module.exports = router;