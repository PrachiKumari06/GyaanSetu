import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import cookieParser from "cookie-parser"; // ✅ to parse cookies from request of admin,user logout jo cookie me store hua ab delete ho jayega
import cors from "cors"; // ✅ to allow cross origin requests from frontend to backend

import fileUpload from "express-fileupload"; // ✅ for file upload in image as in npm :express-fileupload also run in cmd: npm install express-fileupload
import { v2 as cloudinary } from "cloudinary"; // ✅ to upload here on cloudinary

const app = express();
dotenv.config(); // ✅ loads all the variables from .env file

// ✅ middleware
app.use(express.json()); // to read json data from request body
app.use(cookieParser());  // ✅ this line enables req.cookies


app.use(
  fileUpload({
    // for file upload (image/pdf/video)
    useTempFiles: true, // use temp files before uploading to cloudinary
    tempFileDir: "/tmp/", // temp folder for those files
  })
);

app.use(cors({
  origin: "http://localhost:5173", // frontend url
  credentials: true, // to send cookies
  methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // allowed headers in request
}))

// ✅ port and database
const port = process.env.PORT || 3000; // default port
const DB_URI = process.env.MONGO_URI; // from .env file (Mongo Atlas link)

// ✅ MongoDB connection using mongoose
try {
  await mongoose.connect(DB_URI, {
    serverSelectionTimeoutMS: 10000, // if not connect in 10 sec then give error
  });
  console.log("✅ Connected to MongoDB");
} catch (error) {
  console.log("❌ error in connecting MongoDB", error);
}

// ✅ defining routes
app.use("/api/v1/course", courseRoute); // this is for course collection
app.use("/api/v1/user", userRoute); // this is for user collection
app.use("/api/v1/admin", adminRoute);


// ✅ cloudinary config (upload images)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // from .env file
  api_key: process.env.CLOUD_API_KEY, // from .env file
  api_secret: process.env.CLOUD_API_SECRET, // from .env file
});

// ✅ starting the server
app.listen(port, () => {
  console.log(`🚀 Example app listening on port ${port}`);
});
