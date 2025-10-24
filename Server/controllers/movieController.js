const movieModel = require("../models/movieSchema");

const addMovie = async (req, res, next) => {
    try {
        const newMovie = new movieModel(req?.body);
        await newMovie.save();
        res.send({
            success: true,
            message: "New Movie had been Added",
            // by design choice we are not entering data here
        });
    } catch (error) {
        res.status(400);
        next(error);
    }
};

const getAllMovies = async (req, res, next) => {
    try {
        const allMovies = await movieModel.find();
        res.send({
            success: true,
            message: "All movies has been fetched",
            data: allMovies,
        });
    } catch (error) {
        res.status(400);
        next(error);
    }
};

const updateMovie = async (req, res, next) => {
    try {
        const movie = await movieModel.findByIdAndUpdate(
            req?.body?.movieId,
            req.body,
            { new: true } // returns latest updated data, not old one by default 
        );
        res.send({
            success: true,
            message: "The Movie has been updated",
            data: movie,
        });
    } catch (error) {
        res.status(400);
        next(error);
    }
};

const deleteMovie = async (req, res, next) => {
    try {
        const movieId = req.params.movieId;
        await movieModel.findByIdAndDelete(movieId);
        res.send({
            success: true,
            message: "The movie has been deleted",
        });
    } catch (error) {
        res.status(400);
        next(error);
    }
};

module.exports = {
    addMovie,
    getAllMovies,
    updateMovie,
    deleteMovie,
};