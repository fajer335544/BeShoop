const Order = require('./../models/orderModel');
const Repository =require('./../models/repositoryModel')
const Product = require('./../models/productModel')
const Pharmacy = require('../models/pharmacyModel');
const TransmissionLine = require('./../models/transmissionLineModel');
const Region = require('./../models/regionModel');
const Driver = require('./../models/driverModel');

const catchAsync = require('./../utils/catchAsync');
const Features = require('./../utils/apiFeature');
const getDate = require('./../utils/getDate');
const fs = require('fs');
const {ar} = require('./../utils/associationRules');

exports.createOrder = catchAsync(async (req,res,next)=>{

  let arrivedDay;
  for (let [repository, products] of Object.entries(req.body)){
    
    let totalPrice = 0;
    let prods = [];
    let productsDetails = {prices : [] , quantities : [],dates:[]};

    await Repository.findByIdAndUpdate(repository , {
      // $push: {"pharmacies": req.user.manage}
      $addToSet: {"pharmacies": req.user.manage}
    });

    
    await Pharmacy.findByIdAndUpdate(req.user.manage , {
      $addToSet: {"repositories": repository}
    })
    
    for(let product of products){
    
      const pro = await Product.findById(product.id);
      const pop = pro.popularity;
      totalPrice += pro.price * product.itemQuantity;
      prods.push(product.id);
      await Product.findByIdAndUpdate(product.id , {
        quantity : pro.quantity - product.itemQuantity,
        popularity : pop+1
      },{new : true , runValidators : true}
      )
      productsDetails.prices.push(pro.price);
      productsDetails.quantities.push(product.itemQuantity);
      productsDetails.dates.push(new Date().toISOString().split('T')[0]);

    }
    const order = await Order.create({
      totalPrice,
      products : prods,
      pharmacy : req.user.manage,
      repository,
      productsDetails
    })
    const pharmacy = await Pharmacy.findById(req.user.manage);
    console.log("Pharmacy" , pharmacy);

    const pharmacyRegion = await Region.findById(pharmacy.address.region.toString());
    
    console.log("pharmacyRegion : ",pharmacyRegion)
    const TLs = await TransmissionLine.find();
    let transmissionLine;
    TLs.forEach(tl =>{
      tl.regions.forEach(el=>{
        if(el.toString() === pharmacyRegion.id.toString())
        {
          transmissionLine = tl;
          return;
        }
      })
    })
    arrivedDay = transmissionLine.tripsDates[fun(transmissionLine , 1)];

    await Order.findByIdAndUpdate(order.id , {
      driver : transmissionLine.driver
    })
    
    await Driver.findByIdAndUpdate(transmissionLine.driver , {
      $push: {"orders": order.id}
    });
    
  }
  // اليوم المتوقع لوصول الطلبية
  res.status(201).send(arrivedDay);
})


exports.getOrders = catchAsync(async (req,res,next)=>{  

  const features = new Features(Order.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

  const orders = await features.query.sort({createAt:-1}).populate({
    path : 'products',
    select : '-__v -createAt'
  }).populate({
    path : 'repository',
    select : '-__v -createAt -pharmacies -products'
  }).populate({
    path : 'pharmacy',
    select : 'name'
  })

  console.log("orders : ",orders);
  res.status(200).json({
    status : 'success',
    orders
  })
});

exports.checkOffers = async (req, res, next)=>{
  let arr = [];
  const id = req.params.id;
  fs.writeFile('mynewfile3.csv' , `productId,Date,name,price\n`,(err)=>{
    if (err) throw err;
})
  const orders = await Order.find({repository:id}).populate({path: 'products'});

  for(let i=0; i<orders.length; i++){
    arr.push(
      [
        orders[i].id, 
        orders[i].productsDetails.dates[0],
        orders[i].products[0].name,
        orders[i].productsDetails.prices[0]
      ]
    )
  }

  arr.forEach(item =>{
    fs.appendFile('mynewfile3.csv' , `${item.toString()}\n`,(err)=>{
      if (err) throw err;
    })
  })
  const result = await ar();

  for(let i=0; i<result.length ;i++){
    for(let j=0; j<result.length ;j++){
      if(i !== j){
        let x = [...result[i].lhs,...result[i].rhs];
        let y = [...result[j].lhs,...result[j].rhs];
        x.sort() ; y.sort() ;
        if(String(x) === String(y))
        {
          result.splice(j,1);
        }
      }
    }
  }
  console.log(result.length);
  res.status(200).json({
    result
  })
}


const fun = (transmissionLine , mul)=>{
  let index = -1;
  while(index === -1){
    let dt = new Date();
    dt.setTime(dt.getTime() + ((24 * 60 * 60 * 1000)*mul));
    const d = getDate.getDate(dt);
    index = transmissionLine.tripsDates.indexOf(d.split(',')[0]);
    mul++;
  }
  return index;
}