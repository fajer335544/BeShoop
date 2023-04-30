// const joi = require('joi');
// const validator = require('express-joi-validation').createValidator({});
const express = require('express');
const router = express.Router();
const productController = require('./../controllers/productController');
const authController = require('./../controllers/authController');
const uploadImage = require('./../utils/uploadImages');

// const addScheam = joi.object({
//   username : joi.string().min(3).max(24).required(),
//   password : joi.string().min(8).max(24).required(),
//   email : joi.string().email().required(),
// });


router.route('/')
  .post
  (
    authController.protect,
    uploadImage.uploadSingle,
    productController.addProducts
  )
  .get
  (
    authController.protect,
    productController.getProductsByRepo
  )

router.patch('/:id' ,
  authController.protect,
  productController.updateProduct
  )  

router.delete('/:id' ,
  authController.protect,
  productController.deleteProduct
)

module.exports = router;