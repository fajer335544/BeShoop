const Order = require('./../models/orderModel');
const catchAsync = require('./../utils/catchAsync');

exports.createOrder = catchAsync(async (req,res,next)=>{
  const order = await Order.create(req.body);
  res.status(201).json(order);
})