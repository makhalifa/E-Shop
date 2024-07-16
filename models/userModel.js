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
    role: {
      type: String,
      enum: ['user', 'admin'],
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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {   // if password is not modified
    return next();
  }

  // Hashing user password
  const salt = bcrypt.genSaltSync(10); // 10 rounds
  this.password = await bcrypt.hashSync(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
