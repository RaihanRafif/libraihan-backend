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
