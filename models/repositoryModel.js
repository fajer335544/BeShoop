const mongoose = require('mongoose');

const repositorySchema = new mongoose.Schema({
  
  name : {
    type : String,
    required : [true , 'please enter your repo name'],
    unique : true,
  },
  address : {
    region : {
      type : mongoose.Types.ObjectId,
      ref : 'Region',
      required : true, 
    },
    details : {
      type : String
    }
  },
  phone : {
    type : String,
    required : true
  },
  CommercialRegistrationNo : {
    type : String,
    required : true
  },
  isActive : {
    type : Boolean,
    default : false
  },
  pharmacies : {
    type : [mongoose.Types.ObjectId],
    ref : 'Pharmacy',
    default : [],
  },
  products : {
    type : [mongoose.Types.ObjectId],
    ref : 'Product',
    default : []
  },
  image : {
    type : String,
    default : 'businessMan'
  },
  coverImage : {
    type : String,
    default : 'warehouseCover'
  },
  createdAt : {
    type : Date,
    default : new Date().toISOString().split('T')[0]
  }
})

const Repository = mongoose.model('Repository' , repositorySchema);

module.exports = Repository;