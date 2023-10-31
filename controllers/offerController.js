const Offer = require('./../models/OfferModel');

exports.createOffer = async (req,res)=>{
  req.body.image = req.file.filename;
  const offer = await Offer.create(req.body);

  res.status(201).json({
    data : offer
  })
}