import { Admin} from "../models/admin.model.js";
import bcrypt from "bcryptjs"; // ❌ don't use {bcrypt} — correct import shown
import jwt from "jsonwebtoken"; //in cmd:npm i jsonwebtoken
import { z } from "zod";
import config from "../config.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  //to apply limitation and validation we use :npm i zod :
  const adminSchema = z.object({
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
  const validatedData =adminSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res
      .status(400)
      .json({ errors: validatedData.error.issues.map((err) => err.message) });
  }

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new Admin
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    return res.status(201).json({
      message: "Admin created successfully",
      admin: newAdmin,
    });
  } catch (error) {
    console.log("Error during admin signup:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email: email });
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!admin || !isPasswordCorrect) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }

    // jwt code
    const token = jwt.sign(
      {
        id: admin._id,
      },
      config.JWT_ADMIN_PASSWORD, //YE JO ENV AND CONFIG ME BANAYA HAI USKO YAHAN USE KRNA HAI
      { expiresIn: "1d" } //ek da ke expire baad expire
    );
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      secure: process.env.NODE_ENV === "production", // only send cookie over https in production
      sameSite: "Strict",
    };
    res.cookie("jwt", token, cookieOptions);
    res.status(201).json({ message: "Login successful", admin, token });
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
