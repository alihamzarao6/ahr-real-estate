import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

// routers
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
import listingRouter from "./routes/listingRouter.js";

dotenv.config();
const app = express();

// create a dynamic route for all other servers and computers
const __dirname = path.resolve();

// middlewares
app.use(express.json());
app.use(cookieParser());

// routing middlwares
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/listing", listingRouter);

app.use(express.static(path.join(__dirname + "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "client" + "dist" + "index.html"));
});

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
