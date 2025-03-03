const jwt = require("jsonwebtoken");
const User = require('../models/User');
const {promisify} = require("util");

const signToken = (id, email, firstName, lastName) => {
    const expiresIn = process.env.JWT_EXPIRES_IN?.trim() || "90d";

    return jwt.sign({ id, email, firstName, lastName }, process.env.JWT_SECRET, { expiresIn });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id, user.email, user.firstName, user.lastName);
    const cookieOptions = {
        expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 90) * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    return true;
};

const isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            const currentUser = await User.findById(decoded.id);

            if (!currentUser) {
                return next();
            }

            res.locals.user = currentUser;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ status: 'error', message: 'Vous n\'avez pas la permission d\'effectuer cette action' });
        }
        next();
    };
};

module.exports = { createSendToken, isLoggedIn, restrictTo };