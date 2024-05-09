const mongoose = require('mongoose');

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() =>
      console.log(`MongoDB connected with server: ${mongoose.connection.host}`)
    )
    // .catch((err) => {
    //   console.log(`MongoDB connection failed: ${err.message}`);
    //   process.exit(1);
    // });
};

module.exports = connectDB;
