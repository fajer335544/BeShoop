const router = require('express').Router();
const regionController = require('./../controllers/regionController');
const authController = require('./../controllers/authController');

router.post('/' /*,authController.protect , authController.resetPassword('admin')*/, regionController.addRegion);
router.get('/' /*,authController.protect , authController.resetPassword('admin')*/, regionController.getRegions);

module.exports = router;