const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImg: String,
    password: {
      type: String,
      required: [true, 'Password is required'],
      min: [6, 'Password must be at least 6 characters'],
    },
    // record for the last password change
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: ['user', 'moderator', 'admin'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const setImgUrl = (doc) => {
  if (doc.profileImg) {
    const imgUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    doc.profileImg = imgUrl;
  }
};

userSchema.post('init', (doc) => {
  setImgUrl(doc);
});

userSchema.post('save', (doc) => {
  setImgUrl(doc);
});

// hash password before saving or updating
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// when the password change we need to update the passwordChangedAt field
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// pre mongoose middleware when findByIdAndUpdate this update password bcrypt the password
userSchema.pre('findOneAndUpdate', async function (next) {
  const doc = this.getUpdate();
  if (doc.password) {
    const salt = await bcrypt.genSalt(10);
    doc.password = await bcrypt.hash(doc.password, salt);
    doc.passwordChangedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
