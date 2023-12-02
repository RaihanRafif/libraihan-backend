

module.exports = (sequelize, Sequelize) => {
    const Authentication = sequelize.define('Authentication', {
        // Model attributes are defined here
        token: {
            type: Sequelize.STRING,
            allowNull: false
        }

    })
    return Authentication
}