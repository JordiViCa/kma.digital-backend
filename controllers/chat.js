const User = require('../models/user')
const Chat = require('../models/chat')
const Message = require('../models/message')
const Project = require('../models/project')


var path = require('path');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fs = require("fs");
const chat = require('../models/chat');

var controller = {
    create: async function(req, res) {
        console.log("[POST]"+" Create Chat")
        if (req.body.project) {
            Project.findById({_id: req.body.project}).populate(["client"]).then(
                project => {
                    const chat = new Chat({
                        titol: req.body.titol,
                        horaSolicitud: new Date(),
                        client: project.client._id,
                        project: project._id
                    });
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
                }
            )
            return;
        }
        const chat = new Chat({
            titol: req.body.titol,
            horaSolicitud: new Date(),
            client: jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).client,
        });
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
    getAll: async function(req, res) {
        console.log("[GET]"+" Get all Chats")
        Chat.find({client: jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).client}).populate(['messages','project','client',{path: 'messages', populate: ['sender',{path: 'sender', populate: ['client']}]}])
        .then(
            chats => {
                let ch = JSON.parse(JSON.stringify(chats))
                for (let i = 0; i < ch.length; i++) {
                    let unreaded = 0
                    ch[i].messages.forEach(msg => {
                        if (msg.sender.employee) {
                            msg.sender.email = "";
                        }
                        if (msg.sender.employee && !msg.seenDate) {
                            unreaded += 1;
                        }
                    });
                    ch[i]["unreaded"] = unreaded;
                }
                res.status(200).json({
                    data: ch
                });
            }
        )
    },
    getOne: async function(req,res) {
        console.log("[GET]"+" Get chat")
        Chat.findById({_id: req.params.id}).populate(['messages','project','client',{path: 'messages', populate: ['sender',{path: 'sender', populate: ['employee','client']}]}])
        .then(
            chat => {
                if (!jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).employee && jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).client != chat.client._id) {
                    res.status(401).json({ message: "Auth falied!"})
                    return;
                }
                chat.messages.map((msg) => {
                    msg.sender.email = "";
                    if (msg.sender.employee) {
                        msg.sender.employee = {name: msg.sender.employee.name}
                    }
                    return msg;
                })
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
        console.log("[POST]"+" Send message")
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
    getAllChats: async function(req, res) {
        console.log("[GET]"+" Get all Chats")
        Chat.find().populate(['messages','project', {path: 'messages', populate: ['sender',{path: 'sender', populate: ['employee','client']}]}]).then(
            chats => {
                let ch = JSON.parse(JSON.stringify(chats))
                for (let i = 0; i < ch.length; i++) {
                    let unreaded = 0
                    ch[i].messages.forEach(msg => {
                        if (ch[i].messages && ch[i].messages.sender && ch[i].messages.sender.email) {
                            ch[i].messages.sender.email = "";
                        }
                        if (!msg.sender.employee && !msg.seenDate) {
                            unreaded += 1;
                        }
                    });
                    ch[i]["unreaded"] = unreaded;
                }
                res.status(200).json({
                    data: ch
                });
            }
        )
    },
    getProjectChats: async function(req, res) {
        console.log("[GET]"+" Get all Chats")
        Chat.find({project: req.params.id}).populate(['messages','project', {path: 'messages', populate: ['sender',{path: 'sender', populate: ['client']}]}]).then(
            chats => {
                if (chats[0].project.client._id != jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).client && !jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).employee) {
                    res.status(401).json({ message: "Auth falied!"})
                    return;
                }
                let ch = JSON.parse(JSON.stringify(chats))
                for (let i = 0; i < ch.length; i++) {
                    let unreaded = 0
                    if (!jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).employee) {
                        ch[i].messages.forEach(msg => {
                            if (msg.sender.employee && !msg.seenDate) {
                                unreaded += 1;
                            }
                        });
                    } else {
                        ch[i].messages.forEach(msg => {
                            if (ch[i].messages && ch[i].messages.sender && ch[i].messages.sender.email) {
                                ch[i].messages.sender.email = "";
                            }
                            if (!msg.sender.employee && !msg.seenDate) {
                                unreaded += 1;
                            }
                        });
                    }
                    ch[i]["unreaded"] = unreaded;
                }
                res.status(200).json({
                    data: ch
                });
            }
        )
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    markAsRead: async function(req, res) {
        console.log("[PUT]"+" Mark as read")
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
        console.log("[PUT]"+" Mark as resolved")
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
        console.log("[PUT]"+" Update chat")
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