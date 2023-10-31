const Product = require('./../models/productModel');
const User = require('./../models/userModel');
const Repository = require('./../models/repositoryModel');
const Pharmacy = require('./../models/pharmacyModel');

const AppError = require('./../utils/appError');
const Features = require('./../utils/apiFeature');
const catchAsync = require('./../utils/catchAsync');

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

  let query = req.query , word;
  if(query.word){
    word = query.word;
    delete query.word
  }

  const features = new Features(Product.find(), query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

  let prods = await features.query.sort({createAt:-1}).populate({
    path : 'repo',
    select : 'name'
  });

  if(word){
    let products = [];
    prods.forEach(item =>{
      if(item.name.match(word))products.push(item);
    })
    prods = Object.assign(products, {});
  }
  
  res.status(200).json({
    status : 'success',
    prods,
    count : prods.length
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

exports.getProductById = catchAsync(async (req,res,next)=>{
  const product = await Product.findById(req.params.id).populate({
    path : 'repo',
    select : 'name'
  })
  if(!product){
    return res.status(404).json({
      stauts : 'failed',
      message : 'This id is not exist'
    })
  }
  // Get Suggested Products
  let ids = [];
  const prods = await Product.find().populate({
    path : 'repo',
    select : 'name'
  });
  const suggestedProducts = prods.map(prod => {
    if(prod.name.match(product.name) && prod.id !== product.id){
      ids.push(prod.id);
      return prod;
    };
  })
  let suggested = suggestedProducts.filter(element => {
    return element !== undefined;
  });
  let i = suggested.length;
  let j = 0;
  const popularity = await Product.find().sort({popularity : -1});

  popularity.forEach(element => {
    if(!(ids.includes(element.id)) && j < popularity.length && i < 8){
      suggested.push(element);
      ids.push(element.id);
      i++,j++;
    }
  })
  res.status(200).json({
    stauts : 'success',
    product,
    suggested
  })
})

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

exports.searchProduct = catchAsync(async (req,res,next)=>{
  const prods = await Product.find();
  const word = req.params.word;
  const products = [];
  prods.forEach(item =>{
    if(item.name.match(word))products.push(item);
  })
  res.status(200).json({
    products
  })
})

exports.getCategories = catchAsync(async (req,res,next)=>{
  const prods = await Product.find();
  const categories = new Set();

  prods.forEach(item =>{
    categories.add(item.category);
  })
  console.log(categories);
  res.status(200).json({
    categories : Array.from(categories)
  });
})