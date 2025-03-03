const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt; 

    if (!token) {
        return res.status(401).json({ status: 'fail', message: 'Non autorisé' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ status: 'fail', message: 'Token invalide' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;
