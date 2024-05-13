const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log(`Mongodb connection error: ${error.name}`);
  });
