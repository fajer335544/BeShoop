const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },

  products : {
    type : [mongoose.Types.ObjectId],
    ref : 'Product'
  },

  priceB : {
    type : Number,
    required : true
  },
  priceA : {
    type : Number,
    required : true
  },

  repo : {
    type : mongoose.Types.ObjectId,
    ref : 'Repository'
  }
})

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;