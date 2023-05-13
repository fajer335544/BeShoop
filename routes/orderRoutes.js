const router = require('express').Router();
const orderController = require('./../controllers/orderController');
const authController = require('./../controllers/authController');

router.route('/:id')
  .post(authController.protect,orderController.createOrder);


module.exports = router;