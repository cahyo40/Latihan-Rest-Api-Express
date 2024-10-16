const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');


exports.authMiddleware = async (req, res, next) => {
    let token;
    let decoded;
    // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    //     token = req.headers.authorization.split(' ')[1];
    // }
    token = req.cookies.jwt;
    if (!token) {
        return next(res.status(401).json({ message: 'Unauthorized' }));
    }

    try {
        decoded = await jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return next(res.status(401).json({ message: 'Token is invalid' }));
    }




    const currentUser = await User.findByPk(decoded.id);

    if (!currentUser) {
        return next(res.status(401).json({ message: 'User not found' }));
    }

    req.user = currentUser;



    next();


}

exports.isAdmin = async (req, res, next) => {
    const roleData = await Role.findByPk(req.user.roleId);
    const roleName = roleData.name;
    if (roleName !== 'Admin') {
        return next(res.status(403).json({ message: 'Forbidden' }));
    }
    next();
}


exports.permissionUser = (...roles) => {
    return async (req, res, next) => {
        const roleData = await Role.findByPk(req.user.roleId);
        const roleName = roleData.name;
        if (!roles.includes(roleName)) {
            return next(res.status(403).json({ message: 'Forbidden' }));
        }

        next();
    }
}