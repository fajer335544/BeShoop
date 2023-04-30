const User = require('./../models/userModel');

exports.getMe = async (req, res, next) => {
  const currnetUser = await User.findById(req.user.id).populate({
    path : 'manage',
    select : 'name address'
  })

  res.status(200).json({
    status  : 'success',
    data : {
      currnetUser
    }
  })
}