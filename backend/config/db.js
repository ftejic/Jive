const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI, {});
    console.log(`Connected to MongoDB: ${con.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

module.exports = connectToDB;
