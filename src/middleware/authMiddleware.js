const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const process =   require('process');

dotenv.config();

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        console.log(req.userId);
        req.userRole = decoded.role;
        console.log(req.userRole);
        
        next();
    } catch (error) {
        console.log(error.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
