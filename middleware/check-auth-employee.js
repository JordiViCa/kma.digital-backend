const jwt = require("jsonwebtoken");
const User = require('../models/user')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET);
        if (!jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).employee) {
            res.status(401).json({ message: "Auth falied!"})
            return;
        }
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "Auth falied!"})
    }
}