const mongoose = require('mongoose');
const validator = require('validator');

const pharmacySchema = new mongoose.Schema({
  
  name :{
    type : String,
    required : [true , 'please provide your pharmacy name ⚕'],
    unique : true
  },
  
  phone : {
    type : String,
    required : true,
    // validate:  {
    //   validator: function(el) {
    //       return validator.isMobilePhone(el , 'ar-SY');
    //   },
    //   message: 'This number is not a valid!'
  },
  address : {
    region : {
      type : mongoose.Types.ObjectId ,
      ref : 'Region',
      // required : true
    },
    details : {
      type : String,
      // required : true
    }
  },
  isActive : {
    type : Boolean,
    default : false
  },
  CommercialRegistrationNo : {
    type : String,
    required : true
  },

  repositories : {
    type : [mongoose.Types.ObjectId],
    ref : 'Repository'
  },
  image : {
    type : String,
    default : ''
  },
  coverImage : {
    type : String,
    default : 'pharmacyCover'
  },
  createdAt : {
    type : Date,
    default : new Date().toISOString().split('T')[0]
  }
    // location: {
  //   type: {
  //     type: String, // Don't do `{ location: { type: String } }`
  //     enum: ['Point'], // 'location.type' must be 'Point'
  //     required: true
  //   },
  //   coordinates: {
  //     type: [Number],
  //     required: true
  //   }
  // },

})

const Pharmacy = mongoose.model('Pharmacy' , pharmacySchema);

module.exports = Pharmacy;