const express = require('express');
const router = express.Router();

const pharmacyController = require('./../controllers/pharmacyController');
const authController = require('./../controllers/authController');
const uploadImage = require('./../utils/uploadImages');

router.post('/',authController.protect,uploadImage.uploadSingle,pharmacyController.createPharmacy);
router.patch('/update/:id',authController.protect,uploadImage.uploadSingle,pharmacyController.updatePharmacy);
router.delete('/delete/:id',authController.restrictTo('admin'),pharmacyController.deletePharmacy);
module.exports = router;      