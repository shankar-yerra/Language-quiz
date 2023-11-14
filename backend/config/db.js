const mongoose = require("mongoose"); // access from mongoose
mongoose.set("strictQuery", false);

const connectDb = async () => { 
  // asynchronous function
  
  try { 
    // try catch block
    await mongoose.connect(process.env.MONGO_URI);   
    // accessing mongo url which is in .env file
    console.log("Db connected Successfully"); 
    // if database is connected

  } catch (error) {

    console.log(error.message); 
    // if database is not connected
    process.exit(1);

  }
};

module.exports = connectDb; // export modules of connect.Db
