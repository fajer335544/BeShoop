const Product = require('./../models/productModel');
const User = require('./../models/userModel');
const Repository = require('./../models/repositoryModel');
const Pharmacy = require('./../models/pharmacyModel');

const AppError = require('./../utils/appError');
const Features = require('./../utils/apiFeature');
const catchAsync = require('./../utils/catchAsync');
const uploadImage = require('./../utils/uploadImages');

exports.addProducts = catchAsync(async (req, res, next) => {
  
    req.body.image = req.file.filename;
    const currentUser = await User.findById(req.user.id);
    
    if(currentUser && !currentUser.manage){
      
        await Product.create({...req.body , user : req.user.id ,
          isAvailable : false,
        })
      
      return res.status(201).send('Products added successfully!');
    }

    if(currentUser && currentUser.manage){
      
        const pro = await Product.create({...req.body , repo : currentUser.manage,user : req.user.id});
        await Repository.findByIdAndUpdate(currentUser.manage , {
          $push: {"products": pro._id.toString()}
        });
      
      return res.status(201).send('Products added successfully!');
    
    }
    
    return next(new AppError('Something went wrong' , 500));

})


exports.getProductsByRepo = catchAsync(async (req,res,next)=>{

  const features = new Features(Product.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

  const prods = await features.query.sort({createAt:-1});

console.log(prods);
  // const currentUser = await User.findById(req.user.id);
  // let products;
  // if(currentUser && currentUser.manage){
  //   repo = await Repository.findById(currentUser.manage).populate({
  //     path : 'products',
  //     select : 'name price description image'
  //   })
  //   products = repo.products;
  // }
  // if(currentUser && !currentUser.manage){
  //   products = await Product.find({user : currentUser.id , isAvailable : true});
  // }
  
  res.status(200).json({
    status : 'success',
    prods
  })
});


exports.updateProduct = catchAsync(async (req,res,next)=>{
  
  const product = await Product.findByIdAndUpdate(req.params.id,req.body , {
    new : true,
    runValidators : true
  })
  
  if(!product)return res.status(404).send('product not found');

  res.status(200).json({
    stauts : 'success',
    product
  })
})

// exports.hideProduct = catchAsync(async (req,res,next)=>{

//   const product = await Product.findByIdAndUpdate(req.params.id , {isAvailable : false} , {
//     new : true,
//     runValidators : true
//   });

//   if(!product)return res.status(404).send('product not found');

//   res.status(200).json({
//     product : '<Hidden>'
//   })

// })

exports.deleteProduct = catchAsync(async (req,res,next)=>{

  const product = await Product.findByIdAndDelete(req.params.id);

  if(!product)return res.status(404).send('product not found');

  res.status(200).json({
    product : '<Removed>'
  })

})

exports.getProductsByPharmacy = catchAsync(async (req,res,next)=>{
  let products = [];
  const currentUser = req.user;
  const pharmacy = await Pharmacy.findById(currentUser.manage);
  if(pharmacy){
    const repos = await Repository.find(
      {
        address : pharmacy.address,
        isActive  :true
      })
    
    
  }
})