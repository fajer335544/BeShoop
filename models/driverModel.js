const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  
  fullName : {type : String,required : true},

  phone : {type : String,required : true},

  address : {
      region : { type : mongoose.Types.ObjectId , ref : 'Region' },
      details : { type : String }
  },

  plateNumber : {type : String,required : true},

  IDNumber : {type : String,required : true},

  orders : {type : [mongoose.Types.ObjectId]},

  image : String,

  coverImage : String,

  freeDays : {type : [String] , default :["اﻷحد", "اﻷثنين", "الثلاثاء", "اﻷربعاء", "الخميس", "الجمعة", "السبت"]}
},{
  toJSON : {virtuals : true},
  toObject : {virtuals : true}
})

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;