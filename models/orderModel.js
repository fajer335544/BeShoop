const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  products : {
    type : [mongoose.Types.ObjectId],
    ref : 'Product'
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Not Processed',
    enum: ['Not Processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Not Processed'
  },
  pharmacy : {
    type : mongoose.Types.ObjectId,
    ref : 'Pharmacy'
  },
  repository : {  
    type : mongoose.Types.ObjectId,
    ref : 'Repository'
  },
  createAt : {
    type : Date,
    default: new Date()
    }
})

const Order = mongoose.model('Order' , orderSchema);

module.exports = Order;