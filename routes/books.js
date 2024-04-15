/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - publisher
 *         - pages
 *         - userId
 *         - ISBN
 *         - genre
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of your book
 *         author:
 *           type: string
 *           description: The book author
 *         publisher:
 *           type: boolean
 *           description: The book publisher
 *         pages:
 *           type: integer
 *           description: The total pages of your book
 *         summary:
 *           type: string
 *           description: The summary of your book
 *         userId:
 *           type: string
 *           description: The ID of user that has this book
 *         ISBN:
 *           type: string
 *           description: The ISBN of your book
 *         genre:
 *           type: string
 *           description: The genre of your book
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the book was updated
 *       example:
 *         id: 1
 *         title: Pride and Prejudice
 *         author: Jane Austen
 *         publisher: Penguin Classics
 *         pages: 336
 *         summary: Novel ini mengisahkan tentang percintaan dan konvensi sosial di Inggris abad ke-19, terutama antara tokoh Elizabeth Bennet dan Mr. Darcy.
 *         userId: user-lbUxfSsLXOQCMn9f
 *         ISBN: 9780141439518
 *         genre: Fiksi Klasik
 *         finished: false
 *         createdAt: 2020-03-10T04:05:06.157Z
 *         updatedAt: 2020-03-10T04:05:06.157Z
* tags:
 *   name: Books
 *   description: The books managing API
 * /api/book:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Upload files to 'public/uploads' directory
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const currentDate = new Date().toISOString().slice(0, 10); // Get current date in format YYYY-MM-DD
        const currentTime = new Date().toISOString().slice(11, 19).replace(/:/g, '');
        const filename = `${currentDate}-${currentTime}-bookCover${ext}`; // Concatenate current date, current time, and userId with file extension
        cb(null, filename); // Generate unique filename based on userId, current date, and current time
    }
});

const upload = multer({ storage: storage });

const bookController = require('../controllers/books.controller')

/* GET users listing. */
router.post('/', upload.single('coverImage'), bookController.create);
router.put('/:id', upload.single('coverImage'), bookController.update)
router.delete('/:id', bookController.delete)
router.get('/', bookController.get)

module.exports = router;
