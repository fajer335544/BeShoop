const express = require('express');
const router = express.Router();

const pharmacyController = require('./../controllers/pharmacyController');
const authController = require('./../controllers/authController');

router.route('/')
      .post(authController.protect ,  pharmacyController.createPharmacy);

module.exports = router;      