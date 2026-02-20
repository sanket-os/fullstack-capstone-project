const movieModel = require("../models/movieSchema");
const AppError = require("../utils/AppError");

/**
 * ----------------------------------------------------
 * Add a New Movie (Admin)
 * ----------------------------------------------------
 */
const addMovie = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new AppError(400, "MOVIE_DATA_REQUIRED", "Movie details are required");
        }

        const newMovie = new movieModel(req?.body);
        await newMovie.save();


        res.status(201).json({
            success: true,
            message: "New movie has been added",
            // by design choice we are not entering data here, we are using .save()
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ----------------------------------------------------
 * Get All Movies (Public)
 * ----------------------------------------------------
 */
const getAllMovies = async (req, res, next) => {
    try {
        const allMovies = await movieModel.find();


        res.status(200).json({
            success: true,
            message: "All movies have been fetched",
            data: allMovies,
        });
    } catch (error) {
        next(error);
    }
};

// we use movieId because the route has :movieId not :id
// names come from the route definition & controller must match it
// use descriptive names like movieId instead of id for clarity

/**
 * ----------------------------------------------------
 * Get Movie by ID
 * ----------------------------------------------------
 */
const getMovieById = async (req, res, next) => {
    try {
        const movie = await movieModel.findById(req.params.id);

        if (!movie) {
            throw new AppError(404, "MOVIE_NOT_FOUND", "Movie not found");
        }
        res.status(200).json({
            success: true,
            message: "The movie has been fetched",
            data: movie,
        });
    } catch (error) {
        res.status(400);
        next(error);
    }
};

/**
 * ----------------------------------------------------
 * Update Movie (Admin)
 * ----------------------------------------------------
 */
const updateMovie = async (req, res, next) => {
    try {
        const { movieId, ...updateData } = req.body;

        if (!movieId) {
            throw new AppError(400, "INVALID_ID", "Invalid movie ID");
        }

        const updatedMovie = await movieModel.findByIdAndUpdate(
            movieId,
            updateData,
            { new: true }
        );

        if (!updatedMovie) {
            throw new AppError(404, "MOVIE_NOT_FOUND", "Movie not found");
        }


        res.status(200).json({
            success: true,
            message: "Movie updated successfully",
            data: updatedMovie,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ----------------------------------------------------
 * Delete Movie (Admin)
 * ----------------------------------------------------
 */
const deleteMovie = async (req, res, next) => {
    try {
        const movieId = req.params.movieId;

        const deletedMovie = await movieModel.findByIdAndDelete(movieId);


        if (!deletedMovie) {
            throw new AppError(404, "MOVIE_NOT_FOUND", "Movie not found");
        }

        res.status(200).json({
            success: true,
            message: "Movie deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    addMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
};
