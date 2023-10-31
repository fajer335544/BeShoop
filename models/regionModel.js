// numbers of repositories
// numbers of pharmacies
// numbers of orders
// satisfics about orders [per month , per year]
// average increace pharmacies in the site per month
// number of drivers
// list of transmissionLines
// update driver

const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  name  :{
    type : String,
    required : true
  },
  governorate : {
    type : String,
    required : true
  }
})

const Region = mongoose.model('Region' , regionSchema);

module.exports = Region;