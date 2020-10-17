const express = require('express');
const router = express.Router();

const apiController = require('../controllers/apiController');

router.post('/login', apiController.login);
router.post('/register', apiController.register);
//router.get('/profil', apiController.getProfil);
//router.post('/profil', apiController.editProfil);

router.get('/', apiController.index);
router.get('/rooster/:id', apiController.getRooster);
router.get('/cart', apiController.cart);
router.post('/buy', apiController.buy);

module.exports = router;