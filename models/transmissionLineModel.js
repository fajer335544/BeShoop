const mongoose = require('mongoose');

const transmissionLineSchema = new mongoose.Schema({
  
  name : {type : String , reuired : true},

  driver : {type : mongoose.Types.ObjectId , ref : 'Driver'},

  regions : {type : [mongoose.Types.ObjectId] , ref : 'Region'},

  tripsDates : {type : [String] , required : true}

})

const TransmissionLine = mongoose.model('TransmissionLine' , transmissionLineSchema);

module.exports = TransmissionLine;