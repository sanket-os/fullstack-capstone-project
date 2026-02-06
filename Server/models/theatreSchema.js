const mongoose = require("mongoose");

const theatreSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        address: {
            type: String,
            required: true,
        },

        phone: {
            type: Number,
            required: true,
        },

        email: {
            type: String,
            required: true,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true,
        },

        isActive: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Theatre = mongoose.model("theatres", theatreSchema);
module.exports = Theatre;

// two liner exports are good & recommended than 1 liner like
// module.exports = mongoose.model("theatres", theatreSchema);

// can use Theater inside file
// clearer in large projects