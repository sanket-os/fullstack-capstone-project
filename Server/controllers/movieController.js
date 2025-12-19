const movieModel = require("../models/movieSchema");

const addMovie = async (req, res, next) => {
    try {
        const newMovie = new movieModel(req?.body);
        await newMovie.save();
        res.send({
            success: true,
            message: "New movie has been added",
            // by design choice we are not entering data here, we are using .save()
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
            message: "All movies have been fetched",
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
            message: "The movie has been updated",
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

// we use movieId because the route has :movieId not :id
// names come from the route definition & controller must match it
// use descriptive names like movieId instead of id for clarity 

const getMovieById = async (req, res, next) => {
    try {
        const movie = await movieModel.findById(req.params.id);

        res.send({
            success: true,
            message: "The movie has been fetched",
            data: movie,
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
    getMovieById,
};