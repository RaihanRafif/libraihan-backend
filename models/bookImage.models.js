

module.exports = (sequelize, Sequelize) => {
    const BookImages = sequelize.define('BookImages', {
        // Model attributes are defined here
        url: {
            type: Sequelize.STRING,
            allowNull: false
        },
        bookId: {
            type: Sequelize.STRING,
            allowNull: false
        },
    })
    return BookImages
}