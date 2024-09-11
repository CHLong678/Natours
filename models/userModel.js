const { model, Schema } = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a name']
    },
    email: {
      type: String,
      required: [true, 'Please enter a email address'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please enter a valid email']
    },
    photo: String,
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user'
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // work on CREATE() vs SAVE()
        validator: function(el) {
          return el === this.password;
        },
        message: 'Password are not the same! Please try again'
      }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    refreshTokens: [
      {
        token: String,
        expiresIn: {
          type: Date,
          default: Date.now() + process.env.REFRESH_EXPIRES_IN * 1
        }
      }
    ]
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    },
    timestamps: true,
    collection: 'Users'
  }
);

//* Pre Middlewares ************************************************
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();

//   this.password = await bcrypt.hash(this.password, 12);

//   this.passwordConfirm = undefined;
//   if (!this.isNew) {
//     this.passwordChangedAt = Date.now() - 1000; // Trừ 1 giây để tránh lỗi đồng bộ thời gian
//   }

//   next();
// });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, async function(next) {
  this.find({ active: { $ne: false } });
  next();
});

//* Instance Methods ***********************************************

// Compare password
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = model('User', userSchema);

module.exports = User;
