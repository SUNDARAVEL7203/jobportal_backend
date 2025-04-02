import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    console.log(fullname, email, phoneNumber, password, role)
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res
        .status(400)
        .json({ message: "Something missing", success: false }); // Checking whether all the fields are correct
    }

    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);


    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already registered", success: false });
    } // Checking whether the email is registered already
    const hashedPassword = await bcrypt.hash(password, 10);
    // password: This is the plain-text password that the user enters.
    // 10: This is the salt rounds, which determines how many times the hashing algorithm is applied.
    // bcrypt.hash() returns a hashed   encrypted version of the password.
    await User.create({
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      profile:{
        profilePhoto: cloudResponse.secure_url
      }
    });
    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    // Extract email, password, and role from the request body
    const { email, password, role } = req.body;

    // Check if any required field is missing
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    // Find the user by email in the database
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    // Check if the provided role matches the user's role
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    // Create token payload with user ID
    const tokenData = {
      userId: user._id,
    };

    // Generate a JWT token with a 1-day expiration
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // Construct user object with required fields only (excluding password)
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    // Send response with the JWT token set as an HTTP-only cookie
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day expiration
        httpsOnly: true, // Prevents client-side access to the cookie
        sameSite: "strict", // Protects against CSRF attacks
      })
      .json({
        message: `Welcome back ${user.fullname}`, // Greeting message
        user, // Return user details
        success: true,
      });
  } catch (error) {
    console.log(error); // Log error for debugging
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the authentication token by setting the cookie to an empty string and expiring it immediately
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.", // Success message after logout
      success: true,
    });
  } catch (error) {
    console.log(error); // Log error for debugging
  }
};

export const updateProfile = async (req, res) => {
  try {
      const { fullname, email, phoneNumber, bio, skills } = req.body;
      console.log(fullname, email, phoneNumber, bio, skills)
      
      const file = req.file;
      // Sending files to cloudinary
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);



      let skillsArray;
      if(skills){
          skillsArray = skills.split(",");
      }
      const userId = req.id; // middleware authentication
      let user = await User.findById(userId);

      if (!user) {
          return res.status(400).json({
              message: "User not found.",
              success: false
          })
      }
      // updating data
      if(fullname) user.fullname = fullname
      if(email) user.email = email
      if(phoneNumber)  user.phoneNumber = phoneNumber
      if(bio) user.profile.bio = bio
      if(skills) user.profile.skills = skillsArray
    
      // resume comes later here...
      if(cloudResponse){
          user.profile.resume = cloudResponse.secure_url // save the cloudinary url
          user.profile.resumeOriginalName = file.originalname // Save the original file name
      }


      await user.save();

      user = {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          profile: user.profile
      }

      return res.status(200).json({
          message:"Profile updated successfully.",
          user,
          success:true
      })
  } catch (error) {
      console.log(error);
  }
}