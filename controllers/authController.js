const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const fs =require('fs');
const path=require('path');


// const sendEmail = require('./../utils/email');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN });
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

exports.signUp = async(req, res, next) => {
 const exect=await User.findOne({fullName:req.body.fullName,phone:phone})

if(exect)
{
    res.status(403).send("this Name Was Already In Use !! Pleace pic a Diffirent One ")
   // console.log((exect.image));
    imageClear(exect.image)

 
 
}
else
{
    const newUser = await User.create({
        fullName: req.body.fullName,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        role: req.body.role,
        phone: req.body.phone,
        gender: req.body.gender,
         image : req.file.filename
    });
    createSendToken(newUser, 201, res);
}
};

exports.login = catchAsync(async(req, res, next) => {
    const { fullName, password } = req.body;
    // 1) check if email and password are inputted
    if (!fullName || !password) {
        return next(new AppError('please provide email and password', 404));
    }
    // 2) check if email is exist and pasword is correct
    const user = await User.findOne({ fullName }).select('+password');
    if (!user || !(user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password!', 401));
    }
    // If eveything Ok , send token
    createSendToken(user, 200, res);

});

exports.protect = catchAsync(async(req, res, next) => {

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logged in', 401));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does not longer exist!', 401));
    }

    // if (currentUser.changedPasswordAfter(decoded.iat)) {
    //     return next(new AppError('User recently changed password , please login again!', 401));
    // }
    req.user = currentUser;
   // res.send("req.user"+req.user);
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) { 
            next(new AppError('You do not have permission to perform this action', 404)); 
        }
        next();
    };
};

exports.forgotPassword = catchAsync(async(req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with this email address!', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send the token to user's email address
    const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? submit a PATCH request
    with your new password and Password confirm to ${resetURL} \n 
    If you didn't forget your password, please ignore this email`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('There was an error sending the email , try again later', 500));
    }
});

exports.resetPassword = catchAsync(async(req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto.createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired , user is exist , set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update passwordChangedAt property 'It's done in pre hook middleware in userModel.js'

    // 4) Log the user in , Send JWT
    createSendToken(user, 200, res);
});

exports.updatePassword = async(req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // 2) check if POSTed password is correct
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError('your current password is wrong!', 401));
    }

    // 3) If so , update password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    // 4) Log user in , send JWT
    createSendToken(user, 200, res);
}

const imageClear =(imagePath)=>{
    filePath=path.join(__dirname,'../public/',imagePath);
   console.log(filePath)
    fs.unlink(filePath,err=>console.log(err))
  }
  