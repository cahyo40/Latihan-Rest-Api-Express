const { User, Profile, Product, Category } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




exports.register = async (req, res) => {
    try {
        const user = await User.create({ name: req.body.name, email: req.body.email, password: req.body.password });

        createSendToken(
            user,
            201,
            res,
        );
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error", error: error.errors });
    }
}

exports.login = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            return next(new Error("Please provide email and password"));
        }

        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
            return next(new Error("User not found"));
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return next(new Error("Password is incorrect"));
        }

        createSendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
}

const createSendToken = (user, statusCode, res) => {

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    const cookieOptions = {
        expire: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }

    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({ status: 'success', token, data: { user } });
}


exports.logout = async (req, res, next) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ status: 'logout success' });
}

exports.getMe = async (req, res, next) => {
    req.user.password = undefined;
    res.status(200).json({ status: 'success', data: { user: req.user } });
}

exports.getMyUser = async (req, res) => {
    const currentUser = await User.findOne({
        where: {
            id: req.user.id,
        },
        include: [{
            model: Profile,
            as: 'profile_user',
            attributes: ['age', 'bio', 'address', 'image'],
        }, {
            model: Product,
            as: 'history_review',
            attributes: {exclude: ['updatedAt','createdAt','category_id']},
            through: {
                attributes: ['createdAt', 'updatedAt','product_id']
            },
            include:[{
                model:Category,
                as:'category',
                attributes:['name','id']
            }],
        }],
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    })

    if (!currentUser) {
        return res.status(404).json({
            status: 'error',
            message: 'User not found'
        })
    }

    res.status(200).json({
        status: 'success',
        data: { currentUser }
    })
}