const Pharmacy = require('./../models/pharmacyModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.createPharmacy = catchAsync(async (req, res, next) => {

  // req.body.address = JSON.parse(req.body.address);
  let image = '' , coverImage = '';
  if(req.files.image){image = req.files.image[0].filename;}
  else{
    if(req.user.gender === 'male'){req.body.image = 'pharmacistMan'}
    else req.body.image = 'pharmacistWomen'
  }
  if(req.files.coverImage){coverImage = req.files.coverImage[0].filename;}
  
  const pharmacy = await Pharmacy.create(
    {...req.body,image,coverImage}
  );

  await User.findByIdAndUpdate(req.user.id , {
    manage : pharmacy.id    
  })
  console.log(pharmacy);
  
  res.status(201).json({
    status: 'success',
    data: {
      pharmacy
  }
})
})

exports.updatePharmacy = async(req,res,next)=>{
  try{
    const {phone,name,address,CommercialRegistrationNo}=req.body;
    
    const exist = await Pharmacy.findOne({_id:req.params.id.toString()})
      if(exist)
      {
        let image = exist.image , coverImage = exist.coverImage , newAddress = {...exist.address};
        if(req.files.image)image = req.files.image[0].filename;
        if(req.files.coverImage)coverImage = req.files.coverImage[0].filename;
        if(address?.region) newAddress.region = address.region;
        if(address?.details) newAddress.details = address.details; 

        await Pharmacy.findByIdAndUpdate(
          req.params.id.toString(),
          {
            phone,
            address : newAddress,
            name,
            CommercialRegistrationNo,
            image,
            coverImage
          }
        )
        res.status(201).send("updated!")
      }

      else res.status(409).send("This id is not a valid")
      
  }
  catch(e)
    {
      console.error(e);
    }
}

exports.deletePharmacy=async(req,res,next)=>{

  await Pharmacy.findByIdAndDelete(req.params.id);
  res.send("done");
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

exports.getPharmacyById = catchAsync(async (req, res, next) =>{
  const pharamacy = await Pharmacy.findById(req.params.id).populate({
    path : 'repositories'
  })
  if(!pharamacy){
    res.status(404).json({
      status : 'This id is not exist'
    })
  }
  res.status(200).json({
    pharamacy
  })
})

// pharmacies
// repos
// number of orders
// all drivers
// tlines