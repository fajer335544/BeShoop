const express = require('express')
const router = express.Router();
const uploadImage = require('./../utils/uploadImages');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

router.post('/signup' ,uploadImage.uploadSingle, authController.signUp);
router.get('/me' ,
        authController.protect,
        userController.getMe
        );

module.exports = router;