const { nanoid } = require('nanoid');
const db = require("../models");
const TokenManager = require('../tokenize/TokenManager');
const Book = db.books;
const BookImage = db.bookImages;

const getBookByTitle = async (title) => {
    const book = await Book.findOne({ where: { title: title } });
    return book;
};

const getBookByAuthor = async (author) => {
    const book = await Book.findAll({ where: { author: author } });
    return book;
};

const getBookByUserId = async (userId) => {
    const book = await Book.findAll({ where: { userId: userId } });
    return book;
};

const getBookById = async (bookId) => {
    const book = await Book.findOne({ where: { id: bookId } });
    return book;
}

const getBookByBookIdAndUserId = async (bookId, userId) => {
    const book = await Book.findOne({ where: { id: bookId, userId: userId } });
    return book;
}

const getBookByTitleAndAuthor = async (title, author, userId) => {
    const book = await Book.findOne({ where: { title: title, author: author, userId: userId } });
    return book;
};


exports.create = async (req, res, next) => {
    try {
        const { title, author, publisher, pages, summary, isbn, genre, finished, bookReview } = req.body;
        const bearerHeader = req.headers.authorization;

        // Verify the bearer token and get the user ID
        const userId = TokenManager.verifyRefreshToken(bearerHeader);

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Validate input
        if (!title || !author || !publisher || !pages || !genre || !finished) {
            return res.status(400).json({ error: "All book details are required" });
        }

        // Check if a book with the same title and author exists for the user
        const existingBook = await getBookByTitleAndAuthor(title, author, userId);
        if (existingBook) {
            return res.status(409).json({ error: "A book with the same title and author already exists for the user" });
        }

        finished ? '' : finished = false

        const book = {
            title,
            author,
            publisher,
            pages,
            summary,
            userId,
            genre,
            bookReview,
            finished,
            ISBN: isbn
        };

        // Create the book
        const createdBook = await Book.create(book);

        if (!createdBook) {
            throw new Error("Book created failed");
        }

        if (req.file) {
            const bookImage = {
                url: req.file.filename,
                bookId: createdBook.id
            }

            const createdBookImage = await BookImage.create(bookImage)

            if (!createdBookImage) {
                throw new Error("Image Book created failed");
            }
        }


        res.status(201).json({
            message: "Book created successfully.",
            data: createdBook,
        });
    } catch (err) {
        next(err);
    }
};

exports.get = async (req, res, next) => {
    try {
        const bookId = req.query.id;
        const bookTitle = req.query.title && String(req.query.title); // Convert if title exists
        const bookAuthor = req.query.author && String(req.query.author); // Convert if author exists
        const bookISBN = req.query.isbn && String(req.query.isbn); // Convert if isbn exists
        const bookPublisher = req.query.publisher && String(req.query.publisher); // Convert if publisher exists

        const bearerHeader = req.headers.authorization;
        const userId = TokenManager.verifyRefreshToken(bearerHeader);

        let books = await getBookByUserId(userId);

        // Combine filter criteria into a single object
        const filterCriteria = {
            ...(bookId && { id: bookId }),
            ...(bookTitle && { title: bookTitle }),
            ...(bookAuthor && { author: bookAuthor }),
            ...(bookISBN && { isbn: bookISBN }),
            ...(bookPublisher && { publisher: bookPublisher }),
        };

        // Filter books based on combined criteria (using spread syntax)
        books = books.filter((book) => {
            return Object.keys(filterCriteria).every((key) => {
                if (key === "title") {
                    // Case-insensitive search for containing words
                    return book.title.toLowerCase().includes(filterCriteria.title.toLowerCase());
                } else {
                    return book[key] == filterCriteria[key] || !filterCriteria[key];
                }
            });
        });
        // Check if any book is found
        if (books.length === 0) {
            const errorMessage = bookId
                ? `Book with id ${bookId} not found.`
                : "No books matching your criteria found.";
            return res.json({ message: errorMessage });
        }

        res.json({
            message: "Books retrieved successfully.",
            data: books,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.update = async (req, res, next) => {
    try {
        const bookId = req.params.id; // Get the book ID from the request parameters
        const { title, author, publisher, pages, summary, isbn } = req.body;
        const bearerHeader = req.headers.authorization;

        // Verify the bearer token and get the user ID
        const userId = TokenManager.verifyRefreshToken(bearerHeader);

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Check if the book exists and belongs to the user
        const book = await getBookById(bookId);
        if (!book || book.userId !== userId) {
            return res.status(404).json({ error: "Book not found or unauthorized" });
        }

        // Update the book with the provided data
        await book.update({
            title,
            author,
            publisher,
            pages,
            summary,
            ISBN: isbn
        });

        res.json({
            message: "Book updated successfully.",
            data: book,
        });
    } catch (err) {
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const bookId = req.params.id; // Get the book ID from the request parameters
        if (!bookId) {
            return res.status(404).json({ error: "Book Not Found" });
        }

        const bearerHeader = req.headers.authorization;

        // Verify the bearer token and get the user ID
        const userId = TokenManager.verifyRefreshToken(bearerHeader);

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Check if the book exists and belongs to the user
        const book = await getBookById(bookId);
        if (!book || book.userId !== userId) {
            return res.status(404).json({ error: "Book not found or unauthorized" });
        }

        // Delete the book
        await book.destroy();

        res.json({ message: "Book deleted successfully." });
    } catch (err) {
        next(err);
    }
};