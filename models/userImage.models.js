

module.exports = (sequelize, Sequelize) => {
    const UserImages = sequelize.define('UserImages', {
        // Model attributes are defined here
        url: {
            type: Sequelize.STRING,
            allowNull: false
        },
        userId: {
            type: Sequelize.STRING,
            allowNull: false
        },
    })
    return UserImages
}