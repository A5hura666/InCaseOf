const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const verifyAsync = promisify(jwt.verify);

const addUserToLocals = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        res.locals.user = null;
        return next();
    }

    try {
        const decoded = await verifyAsync(token, process.env.JWT_SECRET);
        res.locals.user = {
            id: decoded.id,
            email: decoded.email,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            role: decoded.role
        };
    } catch (err) {
        res.locals.user = null;
    }

    next();
};

module.exports = addUserToLocals;