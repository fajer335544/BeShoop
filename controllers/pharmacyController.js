const Pharmacy = require('./../models/pharmacyModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');


exports.createPharmacy = catchAsync(async (req, res, next) => {
  const pharmacy = await Pharmacy.create(req.body);

  await User.findByIdAndUpdate(req.user.id , {
    type : pharmacy.id    
  })
  

  res.status(201).json({
    status: 'success',
    data: {
      pharmacy
  }
})
})

