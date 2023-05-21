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
            date: new Date(),
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
        let task = {
            title: req.body.title,
            description: req.body.description,
            difficulty: req.body.difficulty,
            category: req.body.category
        };
        Task.findByIdAndUpdate({_id: req.params.id},task)
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
        console.log("[POST] Create task error")
        Category.findOne({name: "Error", project: req.body.project}).populate(["project"]).then(
            category => {
                if (jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).client != category.project.client) {
                    res.status(401).json({ message: "Auth falied!"})
                    return;
                }
                const task = new Task({
                    title: req.body.title,
                    description: req.body.description,
                    project: req.body.project,
                    created: jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).userId,
                    category: category._id,
                    difficulty: 1,
                    date: new Date(),
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
            }
        )
        .catch(err => {
            const category = new Category({
                name: 'Error',
                color: '#FF0000',
                project: req.body.project,
            });
            category.save()
            .then( cat => {
                cat.populate('project').then(
                    category => {
                        if (jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).client != category.project.client) {
                            res.status(401).json({ message: "Auth falied!"})
                            return;
                        }
                        const task = new Task({
                            title: req.body.title,
                            description: req.body.description,
                            project: req.body.project,
                            created: jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).userId,
                            category: category._id,
                            difficulty: 1,
                            date: new Date(),
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
                    }
                )
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
        });
    },
    deleteTask: async function(req, res) {
        console.log("[POST] Delete Task")
        let task = {
            deleted: true
        };
        Task.findByIdAndUpdate({_id: req.params.id},task)
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
        let category = {
            name: req.body.name,
            color: req.body.color,
            order: req.body.order
        };
        Category.findByIdAndUpdate({_id: req.params.id},category)
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
        Category.deleteOne({_id: req.params.id})
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
            startTrack: new Date()
        });
        tracking.save()
        .then( async resultT => {
            Task.findById({_id: req.body.task}).populate(['project','category','tracking']).then(
                (task) => {
                    task.tracking.push(resultT._id)
                    task.save()
                    .then( result => {
                        res.status(200).json({
                            message: 'Tracking started',
                            data: resultT
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            )
            .catch(error => {
                Tracking.deleteOne({_id: resultT._id}).then(
                    result => {
                        res.status(500).json({
                            error: error
                        });
                    }
                );
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    endTracking: async function(req, res) {
        // Check if the user doing the edit is the same of the tracking
        console.log("[POST] End tracking")
        let tracking = {
            endTrack: new Date()
        };
        Tracking.findByIdAndUpdate({_id: req.body.id},tracking)
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
        Tracking.deleteOne({_id: req.params.id})
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
        await Task.find({project: req.params.id}).populate(['project','category','tracking'])
        .then(
            tasks => {
                if (!jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).employee && jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).client != tasks[0].project.client) {
                    res.status(401).json({ message: "Auth falied!"})
                    return;
                }
                res.status(200).json({
                    data: tasks
                });
            }
        )
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    getAllCategories: function(req, res) {
        console.log("[GET] Get all Categories of project")
        Category.find({project: req.params.id}).populate(["project"])
        .then( 
            categories => {
                if (!jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).employee && jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).client != categories[0].project.client) {
                    res.status(401).json({ message: "Auth falied!"})
                    return;
                }
                res.status(200).json({
                    data: categories
                });
            }
        )
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    getOneTask: async function(req,res) {
        console.log("[GET] Get one task")
        Task.findById({_id: req.params.id}).populate(['project','category','tracking',{path: 'tracking', populate: ['employee']}])
        .then(task => {
            if (!jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).employee && jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).client != task.project.client) {
                res.status(401).json({ message: "Auth falied!"})
                return;
            }
            task.tracking.map((track) => {
                track.employee = {_id: track.employee._id, name: track.employee.name}
                return track;
            })
            res.status(200).json({
                data: task
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
}

module.exports = controller;