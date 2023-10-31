const TransmissionLine = require('./../models/transmissionLineModel');
const Driver = require('./../models/driverModel');

exports.addTransmissionLine = async (req,res,next) => {
  try{
    const transmissionLine = await TransmissionLine.create(req.body);
    const driver = await Driver.findOne(transmissionLine.driver);

    const freeDays = driver.freeDays.map(el=>{
      if(!transmissionLine.tripsDates.includes(el))return el;
    })
    await Driver.findByIdAndUpdate(transmissionLine.driver , {
      freeDays
    })
    res.status(201).json({
      status: 'success',
      data: {transmissionLine}
    })
  }catch(err){
    res.status(500).json({err});
  }
}

exports.getAllTLines = async (req,res,next)=>{
  try{
    const tls = await TransmissionLine.find().populate({
      path : 'driver',
      select : 'fullName'
    }).populate({
      path : 'regions',
      select:'name'
    })
    res.status(200).json({
      data : tls
    })
  }
  catch(err){
    console.log(err);
  }
}