const User = require('../models/user')
const Chat = require('../models/chat')
const Message = require('../models/message')

var path = require('path');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fs = require("fs");
const chat = require('../models/chat');

var controller = {
    create: async function(req, res) {
        console.log("[POST] Create Chat")
        console.log(req.body)
        const chat = new Chat({
            titol: req.body.titol,
            horaSolicitud: new Date(),
            client: jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).userId,
        });
        if (req.body.project) {
            chat.project = req.body.project
        }
        // Save user and return with 201 or catch error and display
        chat.save()
        .then( result => {
            res.status(200).json({
                message: 'Chat created',
                data: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    edit: async function(req, res) {
        console.log("[POST] Edit Chat")
        const chat = Chat.findById({_id: req.body.id})
        if (req.body.titol  != chat.titol) {
            chat.titol = req.body.titol;
        }
        // Save user and return with 201 or catch error and display
        chat.save()
        .then( result => {
            res.status(200).json({
                message: 'Chat modified',
                data: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
        
    },
    getAll: async function(req, res) {
        console.log("[GET] Get all Chats")
        const chats = await Chat.find({client: jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).userId}).populate(['messages','project'])
        res.status(200).json({
            data: chats
        });
    },
    getOne: async function(req,res) {
        console.log("[GET] Get chat")
        Chat.findById({_id: req.params.id}).populate(['messages','project','client',{path: 'messages', populate: ['sender',{path: 'sender', populate: ['employee','client']}]}])
        .then(
            chat => {
                res.status(200).json({
                    data: chat
                });
            }
        )
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    send: async function(req, res) {
        console.log("[POST] Send message")
        const message = new Message({
            text: req.body.text,
            sentDate: new Date(),
            sender: jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).userId,
        });
        // Save user and return with 201 or catch error and display
        message.save()
        .then( async function(result) {
            await Chat.findOneAndUpdate({_id: req.body.chat}, { $addToSet: {messages: result._id}})
            res.status(200).json({
                message: 'Message sent',
                data: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    getMessages: async function(req, res) {
        console.log("[GET] Get message")
        // Get only 50 and if scroll up pagination
        let p = 0;
        if (req.body.pagination > 0) {
            p = req.body.pagination;
        }
    },
    getAllChats: async function(req, res) {
        console.log("[GET] Get all Chats")
        Chat.find().populate(['messages','project', {path: 'messages', populate: ['sender',{path: 'sender', populate: ['employee','client']}]}]).then(
            chats => {
                let ch = JSON.parse(JSON.stringify(chats))
                for (let i = 0; i < ch.length; i++) {
                    let unreaded = 0
                    ch[i].messages.forEach(msg => {
                        if (!msg.sender.employee && !msg.seenDate) {
                            unreaded += 1;
                        }
                    });
                    console.log(unreaded)
                    ch[i]["unreaded"] = unreaded;
                }
                console.log(ch[0])
                res.status(200).json({
                    data: ch
                });
            }
        )
    },
    getProjectChats: async function(req, res) {
        console.log("[GET] Get all Chats")
        Chat.find({project: req.params.id}).populate(['messages','project', {path: 'messages', populate: ['sender',{path: 'sender', populate: ['employee','client']}]}]).then(
            chats => {
                let ch = JSON.parse(JSON.stringify(chats))
                for (let i = 0; i < ch.length; i++) {
                    let unreaded = 0
                    ch[i].messages.forEach(msg => {
                        if (!msg.sender.employee && !msg.seenDate) {
                            unreaded += 1;
                        }
                    });
                    console.log(unreaded)
                    ch[i]["unreaded"] = unreaded;
                }
                res.status(200).json({
                    data: ch
                });
            }
        )
    },
    markAsRead: async function(req, res) {
        let params = {
            seenDate: new Date()
        }
        Message.findOneAndUpdate({_id: req.params.id}, params).then(
            (result) => {
                res.status(200).json({
                    data: result
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    },
    markAsResolved: async function(req, res) {
        let params = {
            resolt: true
        }
        Chat.findOneAndUpdate({_id: req.params.id}, params).then(
            (result) => {
                res.status(200).json({
                    data: result
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    },
    updateChat: async function(req, res) {
        console.log("[PUT] Update chat")
        let params = {
            titol: req.body.title,
            client: req.body.client,
            project: req.body.project
        }
        Chat.findOneAndUpdate({_id: req.params.id}, params)
        .populate(['messages','project','client',{path: 'messages', populate: ['sender',{path: 'sender', populate: ['employee','client']}]}])
        .then(
            (result) => {
                res.status(200).json({
                    data: result
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    },

}

module.exports = controller;