const Order = require('./../models/orderModel');
const Repo=require('./../models/repositoryModel')
const catchAsync = require('./../utils/catchAsync');
const Product=require('./../models/productModel')

exports.createOrder = catchAsync(async (req,res,next)=>{
  // 
  let CreatOrder;
  for (let [Repositry, Products] of Object.entries(req.body))
  {
  let totalPrice=0;
   //console.log(Repositry);
    CreatOrder= await Order.create({
    repository:Repositry,
    pharmacy:req.user._id,
    status:'Processing',
    totalPrice:0
   })
   for (var a in Products)
   {
     const IdOfProducts= Object.values(Products[a])[0]
      totalPrice= totalPrice+Object.values(Products[a])[4]
    // console.log("Repositiry:"+Repositry)
     console.log("ID:"+ IdOfProducts)
    //  if(IdOfProducts)
   
     
    CreatOrder.products.push(Object.values(Products[a])[0]);
    CreatOrder.save();
  
     const prd = await Product.findById(IdOfProducts);
     const chech= await Product.findByIdAndUpdate(IdOfProducts,{
       quantity : prd.quantity - Object.values(Products[a])[2]
     })




 }

 console.log("repo"+Repositry);
   let price= await Order.findOne({repository:Repositry})
   price.totalPrice=totalPrice;
   price.save();
   console.log("totalPrice for this repo :"+price.totalPrice);


}


res.status(200).json({message:CreatOrder});
  //const repo= await Repo.findById(req.body.id.toString()).populate({ path: 'products', select: 'quantity' })
  //res.send(req.params.id);
  //const exect=
    /* const exect= await Order.findById('645e5bea2f7f1bc11eb65ea1').populate({path:'products'});
     exect.products.push('645e638ed3ef58371c8fff59')
     exect.save();
     res.send(exect.products)
  */
 
  /*

  
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    for(let i=0;i<keys.length;i++){
      const repo = Repository.findById(keys[i]);
      const products = values[i];
      const chech= await Product.findById(products[i].id,{quantity:{$subtract:["$quantity",2]}})

    }

    console.log(prod)
    const prd = await Product.findById(prod);
    const chech= await Product.findByIdAndUpdate(prod,{
      quantity : prd.quantity - 1
    })*/
   
 
 



 /*var result = [];
 var keys = Object.keys(chech);
 keys.forEach(function(key){
     result.push(chech[key]);
 });*/

 

  

//  res.status(201).json(order);
})