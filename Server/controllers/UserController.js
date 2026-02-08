const userModel = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailHelper = require("../utils/emailHelper");

/**
 * ----------------------------------------------------
 * Register User
 * ----------------------------------------------------
 */
const registerUser = async (req, res, next) => {
  try {
    const userExists = await userModel.findOne({ email: req?.body?.email });

    if (userExists) {
      return res.send({
        success: false,
        message: "User Already Exists",
      });
    }

    // hashing 
    const salt = await bcrypt.genSalt(10); // 2^10 ~ 1024 rounds of key expansion inside bcrypt algo
    // not literally hashing 1024 times 

    const hashedPassword = await bcrypt.hash(req?.body?.password, salt);
    // console.log("hashed password", hashedPassword);
    req.body.password = hashedPassword;

    // internally bcrypt uses EksBlowfish key setup algo, applies it to 2^N times
    // to mix password and salt into encryption key state 
    // uses that state to encrypt const text to produce final hash

    const newUser = new userModel(req?.body);
    // console.log("newUser :", newUser);
    await newUser.save(); // Wait for the save operation to complete
    // save will insert document or update the db object 
    // it validates before saving to ensure data type, required fields or custom validation func's

    res.send({
      success: true,
      message: "Registration Successful. Please Login.",
    });

  } catch (error) {
    // console.log(error);
    res.status(400);
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
      return res.send({
        success: false,
        message: "User does not exist. Please register",
      });
    }

    const validatePassword = await bcrypt.compare(
      req?.body?.password,
      user?.password
    );

    if (!validatePassword) {
      return res.send({
        success: false,
        message: "Please enter a valid password",
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
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
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .send({
        success: true,
        message: "You've successfully Logged In",
      });

  } catch (error) {
    res.status(400);
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
    const user = await userModel.findById(req.body.userId).select("-password"); // excludes password

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.send({
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

    if (email == undefined) {
      return res.status(401).json({
        status: "false",
        message: "Please enter the email",
      });
    }

    let user = await userModel.findOne({ email: email });

    if (user == null) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    else if (user?.otp != undefined && user.otp < user?.otpExpiry) {
      return res.json({
        success: false,
        message: "OTP already sent. Please check your email",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    await emailHelper("otp.html", user.email, {
      name: user.name,
      otp: otp,
    });

    res.send({
      success: true,
      message: "OTP has been sent to email",
    });
  } catch (err) {
    res.status(400);
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

    if (password == undefined || otp == undefined) {
      return res.status(401).json({
        success: false,
        message: "Password and OTP are required",
      });
    }

    const user = await userModel.findOne({ otp: otp });

    if (user == null) {
      return res.status(404).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (Date.now() > user.otpExpiry) {
      user.otp = undefined;
      user.otpExpiry = undefined;

      await user.save();

      return res.status(401).json({
        success: false,
        message: "OTP expired",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req?.body?.password, salt);

    // convert this logic into findByIdAndUpdate
    // considering we should not set values as undefined

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.send({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    res.status(400);
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