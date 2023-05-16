const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  
  fullName : {
    type : String,
    required : true,
    unique : true
  },

  password: {
    type: String,
    required: [true, 'please provide a password!'],
    minLength: 8,
    select: false
},

  confirmPassword: {
    type: String,
    required: [true, 'please provide a confirm password!'],
    validate: {
      validator: function(el) {
            return el === this.password;
        },
        message: 'passwords are not the same!'
    }
},
  role: {
    type: String,
    enum: ['admin','pharmacy', 'repository'],
    required : true
},
  image : {
    type : String,
    default : ''
  },
  phone:{
    type : String,
    required: [true, 'please provide a phone number!'],
  },
  
  gender:{
    type : String,
    enum: ['male', 'female'],
    required: [true, 'please provide your gender']
  },

  manage : {
    type: mongoose.Types.ObjectId,
    refPath: 'docModel'
    /* Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
        will look at the `docModel` property to find the right model
    */
  },
  docModel: {
    type: String,
    enum: ['Pharmacy', 'Repository']
  }

})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function(candinatePassword, userPassword) {
  return await bcrypt.compare(candinatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
      const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      return JWTTimestamp < changedTimeStamp;
  }
  return false; // mean not changed
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256')
      .update(resetToken)
      .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds

  return resetToken;

}

const User = mongoose.model('User', userSchema);

module.exports = User;