const express = require('express');
const router = express.Router();

const pharmacyController = require('./../controllers/pharmacyController');
const authController = require('./../controllers/authController');
const uploadImage = require('./../utils/uploadImages');

router.post('/',
      authController.protect,
      uploadImage.uploadFields,
      pharmacyController.createPharmacy
      );

router.patch('/:id',
      authController.protect,
      uploadImage.uploadFields,
      pharmacyController.updatePharmacy
      );

router.delete('/:id',
      authController.protect,
      authController.restrictTo('admin'),
      pharmacyController.deletePharmacy
      );

router.get('/:id',
      authController.protect,
      pharmacyController.getPharmacyById
      )      


module.exports = router;      