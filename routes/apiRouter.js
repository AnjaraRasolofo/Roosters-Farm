const express = require('express');
const router = express.Router();

const userController = require('../controllers/APIUserController');
const pageController = require('../controllers/APIPageController');


router.post('/users/login', userController.login);
router.post('/users/register', userController.register);
router.get('/users/profil', userController.getProfil);
router.post('/users/profil', userController.editProfil);

router.get('/', pageController.getRoosters);
router.get('/rooster/:id', pageController.getRooster);
router.get('/cart', pageController.getCart);
router.post('/buy', pageController.buy);

module.exports = router;