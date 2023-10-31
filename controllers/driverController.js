const Driver = require('./../models/driverModel');
const Features = require('./../utils/apiFeature');


exports.addDriver = async (req,res,next)=>{
  try{
    req.body.address = JSON.parse(req.body.address);
    let image = '' , coverImage = '';
    if(req.files?.image){image = req.files.image[0].filename;}
    if(req.files?.coverImage){coverImage = req.files.coverImage[0].filename;}

    const driver = await Driver.create({...req.body , image , coverImage});
    res.status(201).json({
      status: 'success',
      data : {driver}
    })

  }catch(err){
    res.status(500).json({err});
  }
}

exports.getDrivers = async (req, res, next)=>{
  try{
    const features = new Features(Driver.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

  const drivers = await features.query.sort({createAt:-1}).populate({
    path:'address',
    populate:{
      path : 'region',
      select : 'name -_id'
    }
  })

  res.status(200).json({
    status : 'success',
    data : {drivers}
  })
  }catch(err){
    res.status(404).send('something went wrong!');
  }
}

exports.getDriverById = async (req, res, next)=>{
  const driver = await Driver.findById(req.params.id);
  if(!driver){
    return res.status(404).json({
      status : 'failed',
      message : 'This id is not exist'
    })
  }
  res.status(200).json({
    status : 'success',
    driver
  })
}