import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"; // ❌ don't use {bcrypt} — correct import shown
import jwt from "jsonwebtoken"; //in cmd:npm i jsonwebtoken
import { z } from "zod";
import config from "../config.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  //to apply limitation and validation we use :npm i zod :
  const userSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: "firstName must be atleast 3 char long" }),
    lastName: z
      .string()
      .min(3, { message: "lastName must be atleast 3 char long" }),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "password must be atleast 6 char long" }),
  });
  const validatedData = userSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res
      .status(400)
      .json({ errors: validatedData.error.issues.map((err) => err.message) });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.log("Error during user signup:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordCorrect) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }

    // jwt code
    const token = jwt.sign(
      {
        id: user._id,
      },
      config.JWT_USER_PASSWORD, //YE JO ENV AND CONFIG ME BANAYA HAI USKO YAHAN USE KRNA HAI
      { expiresIn: "1d" } //ek da ke expire baad expire
    );
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      secure: process.env.NODE_ENV === "production", // only send cookie over https in production
      sameSite: "Strict",
    };
    res.cookie("jwt", token, cookieOptions);
    res.status(201).json({ message: "Login successful", user, token });
  } catch (error) {
    res.status(500).json({ errors: "Error in login" });
    console.log("error in login", error);
  }
};

export const logout = (req, res) => {
  try {
    if(!req.cookies.jwt) {
return res.status(401).json({ errors: "Kindly login first" });
    }
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error in logout" });
    console.log("Error in logout", error);
  }
};

export const purchases = async (req, res) => {
  const userId = req.userId; // userId from your middleware (user.mid.js)

  try {
    // ✅ Get all purchase records for this user
    const purchased = await Purchase.find({ userId });

    // ✅ Extract only courseIds from purchased records
    let purchasedCourseId = [];
    for (let i = 0; i < purchased.length; i++) {
      purchasedCourseId.push(purchased[i].courseId);
    }

    // ✅ Get course details for the purchased courses
    const courseData = await Course.find({
      _id: { $in: purchasedCourseId },
    });

    // ✅ Return both purchase records and course details
    res.status(200).json({ purchased, courseData });
  } catch (error) {
    // ❌ Handle errors
    res.status(500).json({ errors: "Error in purchases" });
    console.log("Error in purchase", error);
  }
};
