const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './public');
  },
  
  filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1];
      cb(null, `product_${Date.now()}_${file.originalname.split('.')[0]}.${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
      cb(null, true)
  } else {
      cb(new AppError('Not an image! please upload only images', 400), false);
  }
}

const upload = multer({
  storage,
  fileFilter: multerFilter
});

module.exports  = {
  uploadMany : upload.array('image'),
  uploadSingle :upload.single('image'),
  uploadFields : upload.fields([{name: 'image', maxCount:1},{name: 'coverImage', maxCount:1}])
}
