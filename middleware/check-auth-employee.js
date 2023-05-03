const jwt = require("jsonwebtoken");
const User = require('../models/user')

module.exports = async (req, res, next) => {
    // Try catch -> validate password
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET);
        let user = await User.findById({_id: jwt.decode(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET).userId})
        if (user.employee) {
            next();
        }
        res.status(401).json({ message: "Auth falied!"})
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "Auth falied!"})
    }
}