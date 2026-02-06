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
            type: Array,
            required: true,
        },
        transactionId: {
            type: String,
            required: true,
            unique: true, // prevents duplicate bookings for same payment
        },
        amount: {
            type: Number, // stored in smallest currency unit
            required: true,
        },
        paymentStatus: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// Index for fast lookup of user's bookings
bookingSchema.index({ user: 1 });

const Booking = mongoose.model("bookings", bookingSchema);
module.exports = Booking;