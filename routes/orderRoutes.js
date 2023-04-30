const router = require('express').Router();
const orderController = require('./../controllers/orderController');
const authController = require('./../controllers/authController');

router.route('/')
  .post(orderController.createOrder);


module.exports = router;