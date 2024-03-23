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
        const filename = `${currentDate}-${currentTime}-userId${ext}`; // Concatenate current date, current time, and userId with file extension
        cb(null, filename); // Generate unique filename based on userId, current date, and current time
    }
});

const upload = multer({ storage: storage });

const userController = require('../controllers/users.controller')

/* GET users listing. */
router.post('/', upload.single('coverImage'), userController.create);
router.put('/', upload.single('coverImage'), userController.update)
router.delete('/', userController.delete)
router.post('/login', userController.login)


module.exports = router;
