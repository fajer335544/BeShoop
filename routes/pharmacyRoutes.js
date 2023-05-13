const express = require('express');
const router = express.Router();

const pharmacyController = require('./../controllers/pharmacyController');
const authController = require('./../controllers/authController');
const uploadImage = require('./../utils/uploadImages');

const Validator=require('../middelwares/Validator')


router.post('/',authController.protect,uploadImage.uploadSingle,pharmacyController.createPharmacy);
router.patch('/update/:id',authController.protect,uploadImage.uploadSingle,pharmacyController.updatePharmacy);
router.delete('/delete/:id',authController.protect,authController.restrictTo('admin'),pharmacyController.deletePharmacy);
/*
router.post('/test',Validator('user'),(req,res,next)=>{
    res.send("username"+req.body.fullName)
})*/
router.post('/test',authController.protect,authController.restrictTo('admin'),(req,res,next)=>{
    res.send(req.user)
   
})

module.exports = router;      