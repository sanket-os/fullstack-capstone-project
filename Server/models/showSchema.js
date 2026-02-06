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
            index: true,
        },
        time: {
            type: String,
            required: true,
        }, 
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "movies",
            required: true,
            index: true,
        },
        ticketPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        totalSeats: {
            type: Number,
            required: true,
            min: 1,
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

// Compound index for common queries (movie + date)
showSchema.index({ movie: 1, date: 1 });

// Fast lookup of shows by theatre
showSchema.index({ theatre: 1 });

const Show = mongoose.model("shows", showSchema);
module.exports = Show;