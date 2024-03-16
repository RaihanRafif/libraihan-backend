const { nanoid } = require('nanoid');
const db = require("../models");
const bcrypt = require('bcrypt');
const Book = db.books;

const getBookByTitle = async (title) => {
    const book = await Book.findOne({ where: { title: title } });
    return book;
};

const getBookByAuthor = async (author) => {
    const book = await Book.findAll({ where: { author: author } });
    return book;
};

const getBookById = async (bookId) => {
    const book = await Book.findOne({ where: { id: bookId } });
    return book;
}

exports.get = async (req, res, next) => {
    try {

        // res.json({
        //   message: "Login success!",
        //   data: bookExist.dataValues.id,
        // });

    } catch (error) {

    }
}

exports.create = async (req, res, next) => {
    try {
        // res.json({
        //   message: "Book created successfully.",
        //   data: createdBook,
        // });
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {

        // await book.save(); // Save the updated book
        // res.json({ message: "Book updated successfully.", data: book });
    } catch (err) {
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {

        // await book.destroy(); // Delete the book
        // res.json({ message: "Book deleted successfully.", data: book });
    } catch (err) {
        next(err);
    }
};


