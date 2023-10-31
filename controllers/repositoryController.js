const Repository = require('./../models/repositoryModel');
const User = require('./../models/userModel');
const Product = require('./../models/productModel');
const catchAsync = require('./../utils/catchAsync');
const sse = require('./../sse/index');
const Features = require('./../utils/apiFeature');

// const mongoose = require('mongoose');
// const connection = mongoose.connection;

exports.createRepository = async (req, res, next) => {
  
  req.body.address = JSON.parse(req.body.address);
  let image = '' , coverImage = '';
  if(req.files?.image){image = req.files.image[0].filename;}
  if(req.files?.coverImage){coverImage = req.files.coverImage[0].filename;}  

  try{
    const repository = await Repository.create(Object.assign(req.body , {image , coverImage}));
    await User.findByIdAndUpdate(req.user.id , {
      manage : repository._id    
    });

    (await Product.find({user : req.user.id})).forEach(async product =>{
      product.repo = repository.id;
      product.isAvailable = true; 
      // product.user = undefined;
      repository.products.push(product.id);

      await product.save();
    })
    await repository.save();
    
    // sse.send(repository[0] , 'repo');
    
    res.status(201).json({
      status : 'success',
      data : repository
    })

  }catch(err){
    console.log(err)
    res.status(500).send(err);
}
}

exports.getAllRepositories = catchAsync(async (req, res, next) =>{
  
  let query = req.query , word;
  if(query.word){
    word = query.word;
    delete query.word
  }

  const features = new Features(Repository.find(), query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

  let repositories = await features.query.sort({createAt:-1});

  if(word){
    let repos = [];
    repositories.forEach(item =>{
      if(item.name.match(word))repos.push(item);
    })
    repositories = Object.assign(repos, {});
  }
  
  res.status(200).json({
    status : 'success',
    data : {repositories}    
  })
})

exports.updateRepository = async (req, res, next)=>{
  try{
    const {phone,name,address,CommercialRegistrationNo}=req.body;
    
    const exist = await Repository.findOne({_id:req.params.id.toString()})
      if(exist)
      {
        let image = exist.image , coverImage = exist.coverImage, newAddress = {...exist.address};
        if(req.files.image)image = req.files.image[0].filename;
        if(req.files.coverImage)coverImage = req.files.coverImage[0].filename;
        if(address?.region) newAddress.region = address.region;
        if(address?.details) newAddress.details = address.details; 

        await Repository.findByIdAndUpdate(
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

      else res.status(409).send("not founded")
      
  }
  catch(e)
    {
      console.error(e);
    }
}

exports.checkQuantities = catchAsync(async (req, res, next) =>{
  const currentUser = req.user;
  const products = await Product.find(
    {
      user: currentUser.id,
      isAvailable:true
    });
    const p = products.map(product =>{
      if(product.quantity <= 3){
        return product;
      }
    })
    // Send product with little quantity
})

exports.getRepositoryById = catchAsync(async (req, res, next) =>{
  const repository = await Repository.findById(req.params.id).populate({
    path : 'pharmacies'
  })
  if(!repository){
    res.status(404).json({
      status : 'This id is not exist!'
    })
  }
  res.status(200).json({
    repository
  })
})







/*

exports.createRepository = async (req, res, next) => {
  
  const session = await connection.startSession();
  try{
    await session.startTransaction();
  
    const repository = await Repository.create([req.body] , {session});
    console.log(req.user.id);

    await User.findByIdAndUpdate(req.user.id , {
      manage : repository[0]._id    
    } , {session});
  
    await session.commitTransaction();
    sse.send(repository[0] , 'repo');
    
    res.status(201).json({
      status : 'success',
      data : repository[0]
    })

  }catch(err){
    res.status(500).send(err);
    await session.abortTransaction(); 
    console.log('Aborted transaction');

  }finally{
    console.log('Ended Transction');
    await session.endSession();

  }
}

*/