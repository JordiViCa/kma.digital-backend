const User = require('../models/user')
const Project = require('../models/project')
const Task = require('../models/task')
const Tracking = require('../models/tracking')
const Category = require('../models/category')

var path = require('path');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fs = require("fs");

var controller = {
    createTask: async function(req, res) {
        console.log("[POST] Create task")
        const task = new Task({
            title: req.body.title,
            description: req.body.description,
            difficulty: req.body.difficulty,
            created: jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).userId,
            project: req.body.project,
            category: req.body.category,
            tracking: [],
        });
        task.save()
        .then( result => {
            res.status(200).json({
                message: 'Task created',
                data: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    editTask: async function(req, res) {
        console.log("[POST] Edit Task")
        const task = Task.findById({_id: req.body.id})
        if (req.body.title != task.title) {
            task.title = req.body.title;
        }
        if (req.body.description != task.description) {
            task.description = req.body.description;
        }
        if (req.body.difficulty != task.difficulty) {
            task.difficulty = req.body.difficulty;
        }
        if (req.body.category != task.category) {
            task.category = req.body.category;
        }
        task.save()
        .then( result => {
            res.status(200).json({
                message: 'Task modified',
                data: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    createTaskError: async function(req, res) {
        console.log("[POST] Create task")
        const task = new Task({
            title: req.body.title,
            description: req.body.description,
            project: req.body.project,
            created: jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).userId
        });
        task.save()
        .then( result => {
            res.status(200).json({
                message: 'Task created',
                data: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    editTaskError: async function(req, res) {
        console.log("[POST] Edit Task")
        const task = Task.findById({_id: req.body.id})
        if (task.created != jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).userId) {
            res.status(401).json({ message: "Auth falied!"})
        }
        if (req.body.title != task.title) {
            task.title = req.body.title;
        }
        if (req.body.description != task.description) {
            task.description = req.body.description;
        }
        task.save()
        .then( result => {
            res.status(200).json({
                message: 'Task modified',
                data: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    deleteTask: async function(req, res) {
        console.log("[POST] Delete Task")
        const task = Task.findById({_id: req.body.id})
        task.deleted = true;
        task.save()
        .then( result => {
            res.status(200).json({
                message: 'Task deleted',
                data: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    createCategory: async function(req, res) {
        console.log("[POST] Create category")
        const category = new Category({
            name: req.body.name,
            color: req.body.color,
            project: req.body.project,
        });
        category.save()
        .then( result => {
            res.status(200).json({
                message: 'Category created',
                data: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    editCategory: async function(req, res) {
        console.log("[POST] Edit Category")
        const category = Category.findById({_id: req.body.id})
        if (req.body.name != category.name) {
            category.name = req.body.name;
        }
        if (req.body.color != category.color) {
            category.color = req.body.color
        }
        category.save()
        .then( result => {
            res.status(200).json({
                message: 'Category modified',
                data: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    deleteCategory: async function(req, res) {
        console.log("[POST] Delete Category")
        Category.deletedById({_id: req.body.id})
        .then( result => {
            res.status(200).json({
                message: 'Category deleted',
                data: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    startTracking: async function(req, res) {
        console.log("[POST] Start tracking")
        const tracking = new Tracking({
            employee: jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).employee,
            description: req.body.description,
            startTrack: new Date()
        });
        tracking.save()
        .then( result => {
            res.status(200).json({
                message: 'Tracking started',
                data: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    endTracking: async function(req, res) {
        console.log("[POST] End tracking")
        const tracking = Tracking.findById({_id: req.body.id})
        tracking.endTrack = new Date()
        tracking.save()
        .then( result => {
            res.status(200).json({
                message: 'Tracking ended',
                data: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    deleteTracking: async function(req, res) {
        console.log("[POST] Delete Tracking")
        Tracking.deletedById({_id: req.body.id})
        .then( result => {
            res.status(200).json({
                message: 'Tracking deleted',
                data: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    getAllTasks: async function(req, res) {
        console.log("[GET] Get all Tasks")
        const tasks = await Task.find({project: req.body.id}).populate(['project','category','tracking'])
        if (tasks.project.client._id != jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).userId) {
            res.status(401).json({ message: "Auth falied!"})
            return;
        }
        res.status(200).json({
            data: tasks
        });
    },
    getAllTasksE: async function(req, res) {
        console.log("[GET] Get all Tasks")
        const tasks = await Task.find({project: req.body.id}).populate(['project','category','tracking'])
        res.status(200).json({
            data: tasks
        });
    },
    getAllCategories: async function(req, res) {
        console.log("[GET] Get all Categories")
        const categories = await Category.find({project: req.body.id})
        res.status(200).json({
            data: categories
        });
    },
    getOneTask: async function(req,res) {
        console.log("[GET] Get project")
        const pr = await Project.findById({_id: req.params.id}).populate(['project','category','tracking'])
        if (pr.client._id != jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).userId) {
            res.status(401).json({ message: "Auth falied!"})
            return;
        }
        res.status(200).json({
            data: pr
        });
    },
    getOneTaskE: async function(req,res) {
        console.log("[GET] Get project")
        const pr = await Project.findById({_id: req.params.id}).populate(['project','category','tracking'])
        if (pr.client._id != jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).userId) {
            res.status(401).json({ message: "Auth falied!"})
            return;
        }
        res.status(200).json({
            data: pr
        });
    },
}

module.exports = controller;