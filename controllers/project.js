const User = require('../models/user')
const Project = require('../models/project')

var path = require('path');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fs = require("fs");

var controller = {
    create: async function(req, res) {
        console.log("[POST] Create Project")
        // Change to the id passed by the programmer
        const pr = new Project({
            name: req.body.name,
            domain: req.body.domain,
            client: req.body.client,
            created: new Date()
        });
        pr.save()
        .then( result => {
            res.status(200).json({
                message: 'Project created',
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
        console.log("[POST] Edit project")
        let params;
        let find;
        if (jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).employee) {        
            params = {
                name: req.body.name,
                domain: req.body.domain,
                client: req.body.client,
                public: req.body.public,
                image: req.body.image
            }
            find = {_id: req.params.id}
        } else {
            params = {
                name: req.body.name,
                domain: req.body.domain
            }
            find = {_id: req.params.id, client: jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).client}
        }
        Project.findOneAndUpdate(find,params, {new: true})
        .then( result => {
            res.status(200).json({
                message: 'Project modified',
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
        console.log("[GET] Get all Projects")
        if (jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).employee) {
            Project.find().populate(["client"]).sort({created: 'descending'}).then(
                projects => {
                    res.status(200).json({
                        data: projects
                    });
                }
            )
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
            return;
        }
        Project.find({client: jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).client}).populate(["client"]).then(
            projects => {
                res.status(200).json({
                    data: projects
                });
            }
        )
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    getOne: async function(req,res) {
        console.log("[GET] Get project")
        Project.findById({_id: req.params.id}).populate(["client"]).then(
            pr => {
                if (pr.client._id != jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).client && !jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).employee) {
                    res.status(401).json({ message: "Auth falied!"})
                    return;
                }
                res.status(200).json({
                    data: pr
                });
            }
        )
    },
    getFive: async function(req,res) {
        console.log("[GET] Five projects")
        Project.find({  $or: [{ name: { $regex: new RegExp(req.params.id ,'i')}}]})
        .populate(['client'])
        .limit(5).then(
            (result) => {
                res.status(200).json({
                    data: result
                })
            }
        )
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    getPublished: async function(req,res) {
        console.log("[GET] Published projects")
        Project.find({public: true})
        .then(
            result => {
                result = result.map(el => ({name: el.name,domain: el.domain,image: el.image}))
                res.status(200).json({
                    data: result
                })
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