const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    movieName: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    }, 
    duration: {
        type: Number,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    poster: {
        type: String,
        required: true,
    },
});

const Movies = mongoose.model("movies", movieSchema);

// model is a constructor/class to interact with mongoDB collection
// Movies is name of mongoDB collection that mongoose will use
// schema defines each document inside the collection with field names, data types, validation(required, unique, etc)

// Movies variable is a const that holds model obj that gives you access to useful methods to interact with your DB
// such as 
// Movies.find();          // get all movies
// Movies.findById(id);    // get a specific movie
// Movies.create(data);    // add a new movie
// Movies.updateOne(...);  // update a movie
// Movies.deleteOne(...);  // delete a movie

module.exports = Movies;