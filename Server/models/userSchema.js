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
    },

    password: {
        type: String,
        required: true,
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
    },
    otpExpiry: {
        type: Date,
    },
},
    { timestamps: true }
);


const User = mongoose.model("users", userSchema);
module.exports = User;

