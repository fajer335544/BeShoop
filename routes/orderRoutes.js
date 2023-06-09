const router = require('express').Router();
const orderController = require('./../controllers/orderController');
const authController = require('./../controllers/authController');

router.route('/')
  .post(authController.protect,orderController.createOrder);


module.exports = router;