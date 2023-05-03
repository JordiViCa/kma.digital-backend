const User = require('../models/user')
const Client = require('../models/client')

var path = require('path');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fs = require("fs");

var controller = {
    signup: function(req,res) {
        console.log("[POST] Signup")
        // Hash password and create user
        bcrypt.hash(req.body.password,10, (err, hash) =>  {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // Save user and return with 201 or catch error and display
            user.save()
                .then( result => {
                    const token = jwt.sign(
                        { email: result.email, userId: result._id },
                        process.env.JWT_SECRET,
                        { expiresIn: process.env.JWT_EXPIRES_IN}
                    );
                    res.status(200).json({
                        message: 'User created!',
                        token: token
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        }); 
    },
    login: function(req,res) {
        console.log("[POST] Login")
        // Find user and compare passwords
        let fetchedUser;
        User.findOne({email: req.body.email })
            .then( user => {
                if (user == null) {
                    return false;
                }
                fetchedUser = user;
                return bcrypt.compare(req.body.password, user.password);
            })
            // Check result and create jwt, then return token and expiration
            .then(result => {
                if (!result) {
                    return res.status(401).json({
                        message: "Auth failed"
                    })
                }
                const token = jwt.sign(
                    { email: fetchedUser.email, userId: fetchedUser._id },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES_IN}
                );
                res.status(200).json({
                    jwt: token
                });
            })
    },
    client: async function(req,res) {
        console.log("[POST] Client")
        let user = await User.findById({_id: jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).userId})
        const client = new Client({
            name: req.body.name,
            surname: req.body.surname,
            company: req.body.company,
            phone: req.body.phone,
            cif: req.body.cif,
            interests: req.body.interests,
            description: req.body.description,
        });
        user.type = 0;
        user.client = client._id;
        user.save();
        client.save()
        .then( result => {
            res.status(200).json({
                message: 'Client created!',
                token: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    },
    me: async function(req, res) {
        console.log("[GET] Me")
        await User.findById({_id: jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).userId}).populate(["client", "employee"]).then(
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
    updateClient: async function(req, res) {
        console.log("[POST] Update client")
        await User.findById({_id: jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).userId}).populate(["client", "employee"]).then(
            (result) => {
                update = {}
                if (req.body.name != result.client.name) {
                    update.name = req.body.name
                }
                if (req.body.surname != result.client.surname) {
                    update.surname = req.body.surname
                }
                if (req.body.company != result.client.company) {
                    update.company = req.body.company
                }
                if (req.body.phone != result.client.phone) {
                    update.phone = req.body.phone
                }
                if (req.body.cif != result.client.cif) {
                    update.cif = req.body.cif
                }
                if (req.body.description != result.client.description) {
                    update.description = req.body.description
                }
                const client = Client.findOneAndUpdate({_id: result.client._id},update).then((resu) => {
                    res.status(200).json({
                        data: resu
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
            }
        )
    }
}

module.exports = controller;