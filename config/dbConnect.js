const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const connected = await mongoose.connect(process.env.mongoose_connect);
    console.log("Database connected successfully ", connected.connection.host);
  } catch (err) {
    console.log("Error connecting database: ", err);
    process.exit(1);
  }
};

module.exports = dbConnect;
