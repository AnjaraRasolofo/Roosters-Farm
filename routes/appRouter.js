const express = require('express');
const router = express.Router();
var multer = require('multer');
var path = require('path');

const userController = require('../controllers/appUserController');
const roosterController = require('../controllers/appRoosterController');

let UPLOAD_LOCATION = path.join(__dirname, '../public', 'img', 'roosters');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, UPLOAD_LOCATION)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage })

router.get('/', roosterController.index);

//router.get('/users/profil', userController.getProfil);
//router.post('/users/profil', userController.updateProfil);

router.get('/roosters/', roosterController.getRoosters);
router.get('/rooster/new', roosterController.addRooster);
router.post('/rooster/new', upload.single('file'), roosterController.saveRooster);
router.get('/rooster/:id', roosterController.editRooster);
router.post('/rooster/:id', upload.single('file'), roosterController.updateRooster);
router.post('/rooster/:id/delete', roosterController.deleteRooster);

module.exports = router;