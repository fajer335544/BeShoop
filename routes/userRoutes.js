const express = require('express')
const router = express.Router();

const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

router.post('/signup' , authController.signUp);
router.get('/me' ,
        authController.protect,
        userController.getMe
        );
router.post('/login' , authController.login);        

module.exports = router;