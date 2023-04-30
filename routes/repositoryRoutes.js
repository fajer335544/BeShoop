const router = require('express').Router();

const repositoryController = require('./../controllers/repositoryController');
const authController = require('./../controllers/authController');

router.route('/')
        .post(
        authController.protect ,
        repositoryController.createRepository
        )
        .get(
        authController.protect,
        authController.restrictTo('admin'),
        repositoryController.getAllRepositories
        )

router.patch
('/:id' , authController.protect , repositoryController.updateRepository)

module.exports = router;        