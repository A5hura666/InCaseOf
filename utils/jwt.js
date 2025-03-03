const jwt = require("jsonwebtoken");

const signToken = id => {
    const expiresIn = process.env.JWT_EXPIRES_IN?.trim() || "90d";

    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
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

module.exports = { createSendToken };