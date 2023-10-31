const Repository = require('./../models/repositoryModel');
const Pharmacy = require('./../models/pharmacyModel');
const Driver = require('./../models/driverModel');
const TransmissionLine = require('./../models/transmissionLineModel');
const Order = require('./../models/orderModel');
const mongoose = require('mongoose');

exports.getInfo = async (req,res)=>{
  const repos = await Repository.find();
  const pharmacies = await Pharmacy.find();
  const tLines = await TransmissionLine.find().populate({
    path : 'regions',
    select : 'name'
  });
  const drivers = await Driver.find();
  const orders = await Order.find();

  res.status(200).json({
    repos,
    pharmacies,
    tLines,
    drivers,
    numOrders : orders.length
  })
}

exports.NOJP = async (req, res)=>{
  const query = req.query;
  const count = await Pharmacy.count({
    createdAt : {
        '$gte' : new Date(`${query.year}-${query.month}-1`),
        '$lt' : new Date(`${query.year}-${query.month}-31`)
    }
})
  res.status(200).json({
    countPharmacies : count
  })
}

exports.NOJR = async (req, res)=>{
  const query = req.query;
  const count = await Repository.count({
    createdAt : {
        '$gte' : new Date(`${query.year}-${query.month}-1`),
        '$lt' : new Date(`${query.year}-${query.month}-31`)
    }
})
  res.status(200).json({
    countRepositories : count
  })
}

exports.moneyPerMonth = async (req, res)=>{

  const query = req.query;
  const result = await Order.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" } , year : { $year: "$createdAt"}},
          total: { $sum: { $toInt: "$totalPrice" } }
        }
      }
    ]
  )
  console.log(query)
  let stats = [];
  result.forEach(item => {
    if(item._id.year === +query.year){
    stats.push({
      month : item._id.month,
      total : item.total
    })
  }
  })

  res.status(200).json({
    stats
  })
}

exports.ordersPerMonth = async (req,res)=>{
  const query = req.query;
  const orders = await Order.aggregate([
    {
        $group: {
            _id: {
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" } 
            },
            count : { $sum: 1 },
        }
    }
])
  let stats = [];
  orders.forEach(item => {
    if(item._id.year === +query.year){
    stats.push({
      month : item._id.month,
      count : item.count
    })
  }
  })
  res.status(200).json({
    stats
  })
}

exports.moneyPerMonthR = async (req,res)=>{
  const query = req.query;
  const x = await Order.aggregate([
    {
        $match : {repository : new mongoose.Types.ObjectId(req.params.id)},
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" } 
      },
        total: { $sum: { $toInt: "$totalPrice" } }
      }
    },
  ])
  let stats = [];
  x.forEach(item =>{
    if(item._id.year === +query.year)stats.push({
      month : item._id.month,
      total : item.total
    })
  })
  res.status(200).json({
    stats
  })
}