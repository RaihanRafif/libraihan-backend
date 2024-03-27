require('dotenv').config();

const options=require('./swagger');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'),
    swaggerJsdoc = require("swagger-jsdoc"),
    swaggerUi = require("swagger-ui-express");;

const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');
const quotationsRouter = require('./routes/quotations');

const ErrorHandler = require('./middlewares/errorHandler');

const app = express();
const port = 5000

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const db = require('./models')
db.sequelize.sync()

app.use('/api/user', usersRouter);
app.use('/api/book', booksRouter);
app.use('/api/quotation', quotationsRouter);

const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);


app.use(ErrorHandler)


// error handler
app.listen(port, () => console.log(`App listening on port http://localhost:${port}!`));

module.exports = app;
