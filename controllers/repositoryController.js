const Repository = require('./../models/repositoryModel');
const User = require('./../models/userModel');
const Product = require('./../models/productModel');
const catchAsync = require('./../utils/catchAsync');
const sse = require('./../sse/index');

// const mongoose = require('mongoose');
// const connection = mongoose.connection;

exports.createRepository = async (req, res, next) => {
  
  try{
    const repository = await Repository.create(req.body);
    await User.findByIdAndUpdate(req.user.id , {
      manage : repository._id    
    });

    (await Product.find({user : req.user.id})).forEach(async product =>{
      product.repo = repository.id;
      product.isAvailable = true; 
      // product.user = undefined;
      repository.products.push(product.id);

      await product.save();
      await repository.save();
    })

    // sse.send(repository[0] , 'repo');
    
    res.status(201).json({
      status : 'success',
      data : repository
    })

  }catch(err){
    res.status(500).send(err);
}
}

exports.getAllRepositories = catchAsync(async (req, res, next) =>{
  
  const repositories = await Repository.find();

  res.status(200).json({
    status: 'success',
    data:{
      repositories
    }
  })
})

exports.updateRepository = catchAsync(async (req, res, next)=>{

  const repo = await Repository.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
});

  if (!repo) {
      return next(new AppError('No document found with that ID!', 404));
  }
  res.status(200).json({
      status: 'success',
      data: {
          repo
    }
});
})

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