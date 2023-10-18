import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// models
import User from "./models/userModel.js";

// routers
import userRouter from "./routes/userRoutes.js";

dotenv.config();
const app = express();

// middlewares
app.use("/api/v1/user", userRouter);


// DB connection
const connectToMongoDB = async () => {
  try {
    // Options to avoid deprecation warnings
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(process.env.MONGO_URI, options);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

connectToMongoDB();

let port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
