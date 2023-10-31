const router = require('express').Router();

const repositoryController = require('./../controllers/repositoryController');
const authController = require('./../controllers/authController');
const uploadImages = require('./../utils/uploadImages');

router.route('/')
        .post(
        authController.protect ,
        uploadImages.uploadFields,
        repositoryController.createRepository
        )
        .get(
        authController.protect,
        repositoryController.getAllRepositories
        )
        
router.patch
('/:id' , authController.protect , uploadImages.uploadFields,repositoryController.updateRepository)

router.get('/:id' , authController.protect , repositoryController.getRepositoryById);

module.exports = router;        