const userModel = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailHelper = require("../utils/emailHelper");
const AppError = require("../utils/AppError");

/**
 * ----------------------------------------------------
 * Register User
 * ----------------------------------------------------
 */
const registerUser = async (req, res, next) => {
  try {
    const userExists = await userModel.findOne({ email: req?.body?.email });

    if (userExists) {
      throw new AppError(409, "USER_ALREADY_EXISTS", "User already exists");
    }

    // hashing 
    const salt = await bcrypt.genSalt(10); // 2^10 ~ 1024 rounds of key expansion inside bcrypt algo
    // not literally hashing 1024 times 

    const hashedPassword = await bcrypt.hash(req?.body?.password, salt);

    req.body.password = hashedPassword;

    // internally bcrypt uses EksBlowfish key setup algo, applies it to 2^N times
    // to mix password and salt into encryption key state 
    // uses that state to encrypt const text to produce final hash

    const newUser = new userModel(req?.body);

    await newUser.save(); // Wait for the save operation to complete
    // save will insert document or update the db object 
    // it validates before saving to ensure data type, required fields or custom validation func's

    res.status(200).json({
      success: true,
      message: "Registration Successful. Please Login.",
    });

  } catch (error) {
    next(error);
  }
};

/**
 * ----------------------------------------------------
 * Login User
 * ----------------------------------------------------
 */
const loginUser = async (req, res, next) => {
  // console.log("LOGIN ATTEMPT BODY:", req.body);
  try {
    const user = await userModel.findOne({ email: req?.body?.email })
      .select("+password");;

    if (!user) {
      throw new AppError(
        401,
        "INVALID_CREDENTIALS",
        "User does not exist. Please register"
      );
    }

    const validatePassword = await bcrypt.compare(
      req?.body?.password,
      user?.password
    );

    if (!validatePassword) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid password");
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    // jwt.sign() creates a JWT token.
    // Payload: { userId, email }
    // This is the data encoded into the token.
    // Secret key: process.env.SECRET_KEY
    // Used to sign and later verify the token (keep it private!).
    // Options: { expiresIn: "1d" }
    // expires after 1 day

    res
      .cookie("bms_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        // maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(200).json({
        success: true,
        message: "You've successfully Logged In",
      });

  } catch (error) {
    next(error);
  }
};

// We use user._id because _id is the real MongoDB ID, created automatically.
// user._email does not exist — only user.email exists.
// MongoDB does NOT add underscores to normal fields; _id is the only built-in field that starts with _.

// You can define _email in your schema, but it is not recommended.
// Only _id is meant to start with _, and using underscore prefixes for normal fields causes confusion and breaks conventions.
// MongoDB stores the primary key as _id, not id.

/**
 * ----------------------------------------------------
 * Logout User
 * ----------------------------------------------------
 */
const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("bms_token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};


/**
 * ----------------------------------------------------
 * Get Current User
 * ----------------------------------------------------
 */
const currentUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.userId).select("-password"); // excludes password

    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "User not found");
    }

    res.status(200).json({
      success: true,
      message: "User Details Fetched Successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ----------------------------------------------------
 * Forget Password (Send OTP)
 * ----------------------------------------------------
 */
const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;


    if (!email) {
      throw new AppError(400, "EMAIL_REQUIRED", "Email is required");
    }

    let user = await userModel.findOne({ email: email });

    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "User not found");
    }
    // 🔐 Prevent OTP spam
    if (user.otp && user.otpExpiry && user.otpExpiry > Date.now()) {
      throw new AppError(
        429,
        "OTP_ALREADY_SENT",
        "OTP already sent. Please try later"
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    await emailHelper("otp.html", user.email, {
      name: user.name,
      otp: otp,
    });

    res.status(200).json({
      success: true,
      message: "OTP has been sent to email",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * ----------------------------------------------------
 * Reset Password
 * ----------------------------------------------------
 */
const resetPassword = async (req, res, next) => {
  try {
    const { password, otp } = req.body;

    if (!password || !otp) {
      throw new AppError(
        400,
        "INVALID_INPUT",
        "Password and OTP are required"
      );
    }

    const user = await userModel.findOne({ otp: otp });

    if (!user) {
      throw new AppError(404, "Invalid OTP", "Invalid OTP");
    }

    if (Date.now() > user.otpExpiry) {
      user.otp = undefined;
      user.otpExpiry = undefined;

      await user.save();

      throw new AppError(401, "OTP_EXPIRED", "OTP expired");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req?.body?.password, salt);

    // convert this logic into findByIdAndUpdate
    // considering we should not set values as undefined

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  forgetPassword,
  resetPassword,
};