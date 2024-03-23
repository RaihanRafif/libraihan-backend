const db = require("../models");
const Authentications = db.authentications;


exports.verifyRefreshToken = async (payload) => {
    const result = await Authentications.findOne({ where: { token: payload } });
    return result
}

exports.verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        jwt.verify(bearerToken, SECRET_KEY, (err, authData) => {
            if (err) {
                res.sendStatus(403); // Forbidden
            } else {
                req.authData = authData; // Attach decoded token data to request object
                next();
            }
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};

exports.deleteRefreshToken = async (payload) => {
    const result = await Authentications.destroy({ where: { token: token } });
    return result
}