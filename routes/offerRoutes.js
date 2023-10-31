const router = require('express').Router();

const offerController = require('./../controllers/offerController');
const authController = require('./../controllers/authController');
const uploadImage = require('./../utils/uploadImages');

router.post
(
  '/',
  authController.protect,
  uploadImage.uploadSingle,
  offerController.createOffer
)

module.exports = router;