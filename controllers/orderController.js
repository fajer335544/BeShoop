const Order = require('./../models/orderModel');
const Repo=require('./../models/repositoryModel')
const catchAsync = require('./../utils/catchAsync');
const Product=require('./../models/productModel')

exports.createOrder = catchAsync(async (req,res,next)=>{
  //const repo= await Repo.findById(req.body.id.toString()).populate({ path: 'products', select: 'quantity' })
  //res.send(req.params.id);
  //const exect=
    /* const exect= await Order.findById('645e5bea2f7f1bc11eb65ea1').populate({path:'products'});
     exect.products.push('645e638ed3ef58371c8fff59')
     exect.save();
     res.send(exect.products)
  */

  const order = await Order.create(req.body);
  const  prod=req.body.products
 
 const chech= await Product.findById(prod,{quantity:{$subtract:["$quantity",2]}})

await chech.save()

 /*var result = [];
 var keys = Object.keys(chech);
 keys.forEach(function(key){
     result.push(chech[key]);
 });*/
 res.send( chech);
 

  

//  res.status(201).json(order);
})