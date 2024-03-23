const jwt = require('jsonwebtoken');
const ErrorHandler = require('../middlewares/errorHandler');
require('dotenv').config();

const TokenManager = {

    generateAccessToken: (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_KEY),
    generateRefreshToken: (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),
    verifyRefreshToken: (refreshToken) => {
        try {
            const token = refreshToken.split(' ')[1];
            const payload = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
            return payload;
        } catch (error) {
            throw new ErrorHandler('Refresh token tidak valid');
        }
    },
}

module.exports = TokenManager;
