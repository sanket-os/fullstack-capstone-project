const mongoose = require("mongoose");

// here objectId is a 12 byte unique identifier
// it is used as a primary key for docs in collection
// with ref pointing to the existing mongoose model schema 
// Because it allows us to reference another document in another collection

const showSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true,
        }, 
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "movies",
            required: true,
        },
        ticketPrice: {
            type: Number,
            required: true,
        },
        totalSeats: {
            type: Number,
            required: true,
        },
        bookedSeats: {
            type: Array,
            default: [],
        },
        theatre: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "theatres",
            required: true,
        },
    },
    { timestamps: true }
);


const Show = mongoose.model("shows", showSchema);
module.exports = Show;