const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },

    password: {
        type: String,
        required: true,
        select: false, // prevent accidental exposure
    },

    // admin - BookMyShow onboarding of theatre and movies
    // partner - they will decide when to run movies & how many to run along with cost of tickets
    // user - how to book tickets

    role: {
        type: String,
        enum: ["admin", "partner", "user"],
        required: true,
        default: "user",
    },
    otp: {
        type: String,
        select: false, // sensitive
    },
    otpExpiry: {
        type: Date,
        select: false,
    },
},
    { timestamps: true }
);


const User = mongoose.model("users", userSchema);
module.exports = User;

