const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  description : {
    type : String,
  },

  user : mongoose.Types.ObjectId,

  repo :  mongoose.Types.ObjectId,

  price : {
    type : Number,
    required : true
  },

  isAvailable : {
    type : Boolean,
    default : true
  },
  quantity:{
    type : Number,
    required :true
  },
  createAt:{
    type : Date,
    default : new Date().toISOString()
  },
  image : String

})

const Product = mongoose.model('Product' , productSchema);

module.exports = Product;