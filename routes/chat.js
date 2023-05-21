'use strict';

var express = require('express');
var ChatController = require("../controllers/chat");

const checkAuth = require("../middleware/check-auth");
const checkAuthEmployee = require("../middleware/check-auth-employee");

var router = express.Router();

router.post('/newchat', checkAuth, ChatController.create);
router.get('/mychats', checkAuth, ChatController.getAll);
router.get('/chat/:id', checkAuth, ChatController.getOne);
router.post('/sendmessage', checkAuth, ChatController.send);
router.post('/getmessages', checkAuth, ChatController.send);
router.get('/project/:id', checkAuth, ChatController.getProjectChats);
router.get('/allChats', checkAuthEmployee, ChatController.getAllChats);
router.put('/markAsRead/:id',checkAuth, ChatController.markAsRead);
router.put('/resolve/:id',checkAuthEmployee, ChatController.markAsResolved);
router.put('/update/:id',checkAuthEmployee, ChatController.updateChat);

module.exports = router;