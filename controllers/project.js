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
        console.log("[POST] Edit Chat")
        const pr = Project.findById({_id: req.body.id})
        if (req.body.name != pr.name) {
            pr.name = req.body.name;
        }
        if (req.body.domain != pr.domain) {
            pr.domain = req.body.domain
        }
        pr.save()
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
            const projects = await Project.find().populate(["client"]).sort({created: 'descending'})
            res.status(200).json({
                data: projects
            });
            return;
        }
        const projects = await Project.find({client: jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).userId}).populate(["client"])
        res.status(200).json({
            data: projects
        });
    },
    getOne: async function(req,res) {
        console.log("[GET] Get project")
        const pr = await Project.findById({_id: req.params.id}).populate(["client"])
        if (pr.client._id != jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).userId && !jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).employee) {
            res.status(401).json({ message: "Auth falied!"})
            return;
        }
        res.status(200).json({
            data: pr
        });
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
    }
}

module.exports = controller;