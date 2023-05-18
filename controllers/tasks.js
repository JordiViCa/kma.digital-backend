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
        let task;
        try {
            task = await Task.findById({_id: req.params.id})
        } catch (error) {
            res.status(500).json({
                error: error
            });
            return;
        }
        if (req.body.title && req.body.title != task.title) {
            task.title = req.body.title;
        }
        if (req.body.description && req.body.description != task.description) {
            task.description = req.body.description;
        }
        if (req.body.difficulty && req.body.difficulty != task.difficulty) {
            task.difficulty = req.body.difficulty;
        }
        if (req.body.category && req.body.category != task.category) {
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
                    console.log(err)
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
                            console.log(err)
                            res.status(500).json({
                                error: err
                            });
                        });
                    }
                )
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                });
            });
        });
    },
    editTaskError: async function(req, res) {
        console.log("[POST] Edit Task")
        let task;
        try {
            task = await Task.findById({_id: req.body.id})
        } catch (error) {
            res.status(500).json({
                error: error
            });
            return;
        }   
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
        let task;
        try {
            task = await Task.findById({_id: req.params.id})
        } catch (error) {
            res.status(500).json({
                error: error
            });
            return;
        }
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
        let category;
        try {
            category = await Category.findById({_id: req.params.id})
        } catch (error) {
            res.status(500).json({
                error: error
            });
            return;
        }
        if (req.body.name != category.name) {
            category.name = req.body.name;
        }
        if (req.body.color != category.color) {
            category.color = req.body.color
        }
        if (req.body.order != category.order) {
            category.order = req.body.order
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
            let task;
            try {
                task = await Task.findById({_id: req.body.task}).populate(['project','category','tracking'])
            } catch (error) {
                await Tracking.deleteOne({_id: resultT._id});
                res.status(500).json({
                    error: error
                });
                return;
            }
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
        let tracking;
        try {
            tracking = await Tracking.findById({_id: req.body.id})
        } catch (error) {
            res.status(500).json({
                error: error
            });
            return;
        }
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