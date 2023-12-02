const db = require("../models");
const Authentications = db.authentications;

exports.addRefreshToken = async (token) => {
    const token = await Authentications.create(token);
}

exports.verifyRefreshToken = async (token) => {
    const result = await Authentications.findOne({ where: { token: token } });
    return result
}

exports.deleteRefreshToken = async (token) => {
    const result = await Authentications.destroy({ where: { token: token } });
    return result
}