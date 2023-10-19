import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// routers
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// middlewares
app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);

// middleware to handle error
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error!";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

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
