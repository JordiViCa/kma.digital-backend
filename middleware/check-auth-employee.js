const jwt = require("jsonwebtoken");
const User = require('../models/user')

module.exports = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            console.log("[ERROR] Auth not included")
            res.status(401).json({ message: "Auth falied!"})
            return;
        }
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET);
        if (!jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).employee) {
            console.log("[ERROR] Not an employee")
            res.status(401).json({ message: "Auth falied!"})
            return;
        }
        next();
    } catch (error) {
        console.log("[ERROR] Auth employee",error)
        res.status(401).json({ message: "Auth falied!"})
    }
}