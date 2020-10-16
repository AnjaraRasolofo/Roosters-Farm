const express = require('express');
const router = express.Router();

const frontController = require('../controllers/frontController');

router.get('/', frontController.index);
router.get('/register', frontController.register);
router.post('/register', frontController.saveUser);
router.get('/login', frontController.login);
router.post('/login', frontController.loginCheck);
router.get('/logout', frontController.logout);
router.get('/rooster/:id', frontController.getRooster);
router.get('/cart', frontController.cart);
router.post('/buy', frontController.buy);

module.exports = router;