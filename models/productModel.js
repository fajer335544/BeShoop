const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  description : {
    type : String,
  },

  user : {
    type : mongoose.Types.ObjectId,
    ref : 'User'
  },

  repo :  {
    type : mongoose.Types.ObjectId,
    ref : 'Repository'
  },

  price : {
    type : Number,
    required : true
  },
  category : {
    type : String,
    required : true
  },
  isAvailable : {
    type : Boolean,
    default : true
  },
  quantity:{
    type : Number,
    required :true,
    // min :0
  },
  createAt:{
    type : Date,
    default : new Date().toISOString()
  },
  popularity:{
    type : Number,
    default : 0
  },
  image : String

})

const Product = mongoose.model('Product' , productSchema);

module.exports = Product;