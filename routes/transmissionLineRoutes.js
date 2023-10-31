const router = require('express').Router();

const transmissionLineController = require('./../controllers/transmissionLineController');
const authController = require('./../controllers/authController');

router.post('/',
  // authController.protect,
  // authController.restrictTo('admin'),
  transmissionLineController.addTransmissionLine
)

router.get('/' ,transmissionLineController.getAllTLines);

module.exports = router;