const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        show: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "shows",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        seats: {
            type: [Number],
            required: true,
            validate: {
                validator: (arr) => Array.isArray(arr) && arr.length > 0,
                message: "At least one seat must be booked",
            },
        },
        transactionId: {
            type: String,
            required: true,
            unique: true, // prevents duplicate bookings for same payment
            immutable: true, // prevent modification
        },
        amount: {
            type: Number, // stored in smallest currency unit
            required: true,
            immutable: true, // prevent tampering
        },
        currency: {
            type: String,
            default: "inr",
            lowercase: true,
        },
        paymentStatus: {
            type: String,
            enum: ["succeeded", "pending", "failed"],
            required: true,
        },
    },
    { timestamps: true }
);

// Index for fast lookup of user's bookings
bookingSchema.index({ user: 1 });

// Helps detect duplicate seat allocations faster
bookingSchema.index({ show: 1, seats: 1 });

const Booking = mongoose.model("bookings", bookingSchema);
module.exports = Booking;