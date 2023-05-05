const Pharmacy = require('./../models/pharmacyModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const Features = require('./../utils/apiFeature');

exports.createPharmacy = catchAsync(async (req, res, next) => {
  //res.send("hi");
  const pharmacy = await Pharmacy.create({
    name:req.body.name,
    phone:req.body.phone,
    address:req.body.address,
    
    CommercialRegistrationNo:req.body.CommercialRegistrationNo,
    image:req.file.filename
  });

  await User.findByIdAndUpdate(req.user.id , {
    manage : pharmacy.id    
  })
  

  res.status(201).json({
    status: 'success',
    data: {
      pharmacy
  }
})
})


exports.updatePharmacy= async(req,res,next)=>{

  try{
    //  const update= await Pharmacy.findByIdAndDelete()
   // res.send(req.params.id);
   const {phone,name,address,CommercialRegistrationNo}=req.body;
    const image = req.file.filename
    const exect= await Pharmacy.findOne({_id:req.params.id.toString()})
      if(exect)
      {
      await Pharmacy.findByIdAndUpdate(req.params.id.toString(),{phone:phone,address:address,name:name,CommercialRegistrationNo:CommercialRegistrationNo,image:image})
        res.status(201).send("updated!")
      }
      else
      {
        res.status(409).send("nout founded")
      }

  }catch(e)
{
  console.error(e);
}
}

exports.deletePharmacy=async(req,res,next)=>{

  await Pharmacy.findByIdAndDelete(req.params.id)
  res.send("done")

}
exports.getAllPharmacies = catchAsync(async (req, res, next) =>{

  const features = new Features(Pharmacy.find(), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();

const pharmacies = await features.query.sort({createAt:-1});

res.status(200).json({
status : 'success',
pharmacies
})
});



