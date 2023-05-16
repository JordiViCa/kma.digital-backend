const Contact = require('../models/contact')

var path = require('path');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fs = require("fs");

var controller = {
    create: function(req, res) {
        console.log("[POST] Create contact")
        const contact = new Contact({
            title: req.body.title,
            email: req.body.email,
            name: req.body.name,
            message: req.body.message,
            created: new Date(),
            seen: false
        });
        contact.save()
        .then( result => {
            res.status(200).json({
                message: 'Contact created',
                data: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    getAll: function(req, res) {
        console.log("[GET] Get all contact")
        Contact.find().sort({created: 'descending'}).then(
            (result) => {
                res.status(200).json({
                    data: result
                });
            }
        )
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });    
    },
    markAsSeen: function(req, res) {
        console.log("[PUT] Mark contact as seen")
        let params = {
            seen: true
        }
        Contact.findByIdAndUpdate({_id: req.params.id}, params).then(
            (result) => {
                res.status(200).json({
                    data: result
                });
            }
        )
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    }
}

module.exports = controller;