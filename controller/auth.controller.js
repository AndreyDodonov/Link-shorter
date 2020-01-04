const errorHandler = require('../utils/errorHandler');
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {validationResult, check} = require('express-validator');


module.exports.validate = (method) => {
    if (method === 'register') {
        {
            return [
                check('email', 'incorrect e-mail').isEmail(),
                check('password', 'incorrect password').isLength({min: 6})
            ]
        }
    }

    if (method === 'login') {
        return [
            check('email', 'incorrect e-mail').normalizeEmail().isEmail(),
            check('password', 'incorrect password').exists()
        ]
    }
};

module.exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), message: 'incorrect registration data'});
        }

        const {email, password} = req.body;
        const candidate = await User.findOne({email: email});
        if (candidate) {
            return res.status(400).json({message: 'email already in use ((. Try another'})
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({email, password: hashedPassword});

        await user.save();
        res.status(201).json({message: 'user was created '});

    } catch (e) {
        errorHandler(res, e);
    }
};

module.exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), message: 'incorrect login data'})
        }

        const {email, password} = req.body;

        const user = await User.findOne({email});
        if (!user) {
            res.status(400).json({message: "such e-mail was not found"})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({message: "Passwords do not match"})
        }

        const token = jwt.sign(
            {userId: user.id},  // можно добавлять user.name и т.д
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        );

        await res.json({token, userId: user.id})

    } catch (e) {
        errorHandler(res, e)
    }
};

