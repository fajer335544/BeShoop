const mongoose = require('mongoose');

const repositorySchema = new mongoose.Schema({
  
  name : {
    type : String,
    required : [true , 'please enter your repo name'],
    unique : true,
  },
  address : {
    type : String,
    required : true
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
    default : []
  },
  products : {
    type : [mongoose.Types.ObjectId],
    ref : 'Product',
    default : []
  },
  repositoryImage : String,
  ownerImage : String,
})

const Repository = mongoose.model('Repository' , repositorySchema);

module.exports = Repository;