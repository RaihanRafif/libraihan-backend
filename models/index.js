const dbConfig = require('../config/db.config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorAlias: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// define semua models yang ada pada aplikasi
db.users = require('./users.models')(sequelize, Sequelize);
db.books = require('./Books.models')(sequelize, Sequelize);
db.genres = require('./Genre.models')(sequelize, Sequelize);
db.bookImages = require('./BookImage.models')(sequelize, Sequelize);
db.userImages = require('./UserImage.models')(sequelize, Sequelize);
db.quotations = require('./quotation.models')(sequelize, Sequelize);
db.authentications = require('./authentications.models')(sequelize, Sequelize);

module.exports = db;