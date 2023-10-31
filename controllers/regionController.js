const Region = require('./../models/regionModel');
const Features = require('./../utils/apiFeature');

exports.addRegion = async (req,res,next)=>{
  try{
    const region = await Region.create(req.body);
    res.status(201).json({
      status : 'success',
      data : {region}
    });
  }catch(err){
    res.status(500).send('something went wrong');
  }
}

exports.getRegions = async (req, res, next)=>{
  try{
    const features = new Features(Region.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

  const regions = await features.query.sort({createAt:-1});
  res.status(200).json({
    status : 'success',
    data : {regions}
  })
  }catch(err){
    res.status(404).send('something went wrong!');
  }
}