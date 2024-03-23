var express = require('express');
var router = express.Router();

const quotationController = require('../controllers/quotations.controller')

/* GET users listing. */
router.post('/', quotationController.create);
router.put('/:id', quotationController.update)
router.delete('/:id', quotationController.delete)
router.get('/', quotationController.get)

module.exports = router;
