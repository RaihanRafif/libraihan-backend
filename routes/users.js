var express = require('express');
var router = express.Router();

const userController = require('../controllers/users.controller')

/* GET users listing. */
router.post('/', userController.create);
router.put('/:id',userController.update)
router.delete('/:id',userController.delete)
router.post('/login',userController.login)

module.exports = router;
