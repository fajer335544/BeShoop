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
  productsDetails : {
    prices : {
      type : [Number]
    },
    quantities : {
      type : [Number]
    },
    dates : {
      type : [String]
    }
  },
  status: {
    type: String,
    enum: [ 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  pharmacy : {
    type : mongoose.Types.ObjectId,
    ref : 'Pharmacy'
  },
  repository : {  
    type : mongoose.Types.ObjectId,
    ref : 'Repository'
  },
  createdAt : {
    type : Date,
    default : new Date().toISOString().split('T')[0]
    },
  orderSize : {
    type : Number
  },
  driver: {
    type: mongoose.Types.ObjectId,
    ref: 'Driver',
    
    // required: [true, '']
}
})



// reviewSchema.pre(/^find/, function() {
//   this.populate({
//       path: 'user',
//       select: 'firstName image createAt -_id'
//   });
// });

const Order = mongoose.model('Order' , orderSchema);

module.exports = Order;