const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            res.status(401).json({ message: "Auth falied!"})
            return;
        }
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "Auth falied!"})
    }
}