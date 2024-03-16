var express = require('express');
var router = express.Router();

const bookController = require('../controllers/books.controller')

/* GET users listing. */
router.post('/', bookController.create);
router.put('/:id', bookController.update)
router.delete('/:id', bookController.delete)
router.get('/', bookController.get)

module.exports = router;
