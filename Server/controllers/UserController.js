const userModel = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
    try {
        const userExists = await userModel.findOne({ email: req?.body?.email });
        if (userExists) {
            return res.send({
                success: false,
                message: "User Already Exists",
            });
        }

        // hashing usecase
        const salt = await bcrypt.genSalt(10); // 2^10 ~ 1024 rounds of key expansion inside bcrypt algo
        // not literally hashing 1024 times 
        const hashedPassword = await bcrypt.hash(req?.body?.password, salt);
        console.log("hashed password", hashedPassword);
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
            message: "Registration Successful, Please Login",
        });

    } catch (error) {
        // implement error handler middleware later
        // console.log(error);
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const user = await userModel.findOne({ email: req?.body?.email });

        if (!user) {
            return res.send({
                success: false,
                message: "User does not exist. Please register",
            });
        }

        // if (req?.body?.password !== user?.password) {
        const validatePassword = await bcrypt.compare(
            req?.body?.password,
            user?.password
        );

        if (!validatePassword) {
            return res.send({
                success: false,
                message: "Please enter valid password",
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
        // The token expires in 1 day.

        res.send({
            success: true,
            message: "You've successfully Logged In",
            data: token,
        });

    } catch (error) {
        next(error);
    }
};

const currentUser = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.body.userId).select("-password"); // excludes password
        // you can use req.user.userId here to avoid overwrite/replace the current data
        res.send({
            success: true,
            message: "User Details Fetched Successfully",
            data: user,
        });
    } catch (error) {   
        next(error);
    }
}

module.exports = {
    registerUser,
    loginUser,
    currentUser,
};