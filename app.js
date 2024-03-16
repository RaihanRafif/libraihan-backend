const ErrorHandler = require('./middlewares/errorHandler');

const express = require('express');
const path = require('path');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');

const app = express();
const port = 3000


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const db = require('./models')
db.sequelize.sync()

app.use('/api/user', usersRouter);
app.use('/api/book', booksRouter);


app.use(ErrorHandler)


// error handler
app.listen(port, () => console.log(`App listening on port http://localhost:${port}!`));

module.exports = app;
