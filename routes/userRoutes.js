const express = require('express')
const router = express.Router();
const uploadImage = require('./../utils/uploadImages');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const  {body}  = require('express-validator');
const User=require('../models/userModel');
//const validate= body('fullName').custom(async(value, { req,res }) => {return await User.findOne({ fullName: value }).then(userDoc => {if (userDoc) {return res.status(409).send('This name exists already, please pick a different one.') ;}})})

router.post('/signup' ,uploadImage.uploadSingle, authController.signUp);
router.get('/me' ,
        authController.protect,
        userController.getMe
        );

module.exports = router;