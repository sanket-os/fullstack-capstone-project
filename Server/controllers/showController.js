const Show = require("../models/showSchema");
const AppError = require("../utils/AppError");

/**
 * ----------------------------------------------------
 * Add Show (Admin)
 * ----------------------------------------------------
 */
const addShow = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new AppError(400, "SHOW_DATA_REQUIRED", "Show details are required");
        }

        const newShow = new Show(req.body);
        await newShow.save();


        res.status(201).json({
            success: true,
            message: "New show has been added",
        })
    } catch (error) {
        next(error);
    }
};

/**
 * ----------------------------------------------------
 * Delete Show (Admin)
 * ----------------------------------------------------
 */
const deleteShow = async (req, res, next) => {
    try {
        const showId = req.params.showId;

        const deletedShow = await Show.findByIdAndDelete(showId);

        if (!deletedShow) {
            throw new AppError(404, "SHOW_NOT_FOUND", "Show not found");
        }

        res.status(200).json({
            success: true,
            message: "Show deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ----------------------------------------------------
 * Update Show (Admin)
 * ----------------------------------------------------
 */
const updateShow = async (req, res, next) => {
    try {
        const { showId, ...updateData } = req.body;

        if (!showId) {
            throw new AppError(400, "INVALID_ID", "Invalid show ID");
        }

        const updatedShow = await Show.findByIdAndUpdate(
            showId,
            updateData,
            { new: true }
        );

        if (!updatedShow) {
            throw new AppError(404, "SHOW_NOT_FOUND", "Show not found");
        }

        res.status(200).json({
            success: true,
            message: "Show updated successfully",
            data: updatedShow,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ----------------------------------------------------
 * Get All Shows by Theatre
 * ----------------------------------------------------
 */
const getAllShowsByTheatre = async (req, res, next) => {
    try {
        const theatreId = req.params.theatreId;

        if (!theatreId) {
            throw new AppError(400, "INVALID_ID", "Invalid theatre ID");
        }

        const shows = await Show.find({
            theatre: theatreId
        }).populate("movie");


        res.status(200).json({
            success: true,
            message: "All shows fetched",
            data: shows,
        });
    } catch (error) {
        next(error);
    }
};

// a show only stores id of the theatre
// populate does a 2nd query & inserts the full obj
// it's like automatic JOIN in SQL 

// Show
//  ├── movie: 65c3e...
//  └── theatre: 987fa...

//  V
//  V

//  Show
//  ├── movie: { title: "Dune", year: 2024, ... }
//  └── theatre: { name: "PVR Inox", city: "Mumbai", ... }


/**
 * ----------------------------------------------------
 * Get All Theatres by Movie & Date
 * ----------------------------------------------------
 */
const getAllTheatresByMovie = async (req, res, next) => {
    try {
        const { movie, date } = req.body;

        if (!movie || !date) {
            throw new AppError(400, "MOVIE_DATE_REQUIRED", "Movie and date are required");
        }

        const shows = await Show.find({ movie, date }).populate("theatre");

        let uniqueTheatres = [];

        shows.forEach((show) => {
            // Check if this theatre is already in uniqueTheatres
            let isTheatre = uniqueTheatres.find(
                (theatre) => theatre._id.toString() === show.theatre._id.toString()
            );

            if (!isTheatre) {
                // Filter all shows that belong to this theatre
                let showsOfThisTheatre = shows.filter(
                    (showObj) => showObj.theatre._id.toString() === show.theatre._id.toString()
                );

                uniqueTheatres.push({
                    ...show.theatre._doc,
                    shows: showsOfThisTheatre,
                });
            }
        });

        res.status(200).json({
            success: true,
            message: "All theatres fetched",
            data: uniqueTheatres,
        });
    } catch (error) {
        next(error);
    }
};

// Property	        Meaning
// show	            Mongoose Document (wrapper + methods + metadata)
// show._doc	    Raw data stored in MongoDB (the part you really care about)
// show.toObject()	Clean plain object version
// .lean()	        Makes Mongoose return plain objects directly

// cleaner versions -
// { 
//   ...show.theatre.toObject(),
//   shows: showsOfThisTheatre,
// }

// const shows = await Show.find({ movie, date })
//     .populate("theatre")
//     .lean();   // returns plain JS objects
// Then you no longer need _doc.


/**
 * ----------------------------------------------------
 * Get Show by ID
 * ----------------------------------------------------
 */
const getShowById = async (req, res, next) => {
    try {
        const { showId } = req.params;

        const show = await Show.findById(showId)
            .populate("movie")
            .populate("theatre");

        if (!show) {
            throw new AppError(404, "SHOW_NOT_FOUND", "Show not found");
        }

        res.status(200).json({
            success: true,
            message: "All shows are fetched",
            data: show,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addShow,
    deleteShow,
    updateShow,
    getAllShowsByTheatre,
    getAllTheatresByMovie,
    getShowById,
};