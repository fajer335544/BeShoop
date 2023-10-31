const router = require('express').Router();

const driverController = require('./../controllers/driverController');
const authController = require('./../controllers/authController');
const uploadImages = require('./../utils/uploadImages');

router.post('/',
  // authController.protect,
  // authController.restrictTo('admin'),
  uploadImages.uploadFields,
  driverController.addDriver
)

router.get('/',
  // authController.protect,
  // authController.restrictTo('admin'),
  driverController.getDrivers
)

router.get('/:id' , driverController.getDriverById);

module.exports = router;