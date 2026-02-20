const Theatre = require("../models/theatreSchema");
const AppError = require("../utils/AppError");

/**
 * ----------------------------------------------------
 * Add Theatre (Admin / Owner)
 * ----------------------------------------------------
 */
const addTheatre = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new AppError(400, "THEATRE_DATA_REQUIRED", "Theatre details are required");
        }

        const newTheatre = new Theatre(req.body);
        await newTheatre.save();

        res.status(201).json({
            success: true,
            message: "New theatre has been added",
        });
    } catch (err) {
        next(err);
    }
};

/**
 * ----------------------------------------------------
 * Update Theatre
 * ----------------------------------------------------
 */
const updateTheatre = async (req, res, next) => {
    try {
        const { theatreId, ...updateData } = req.body;

        if (!theatreId) {
            throw new AppError(400, "INVALID_ID", "Invalid theatre ID");
        }

        const updatedTheatre = await Theatre.findByIdAndUpdate(
            theatreId,
            updateData,
            { new: true }
        );

        if (!updatedTheatre) {
            throw new AppError(404, "THEATRE_NOT_FOUND", "Theatre not found");
        }

        res.status(200).json({
            success: true,
            message: "Theatre updated successfully",
            data: updatedTheatre,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * ----------------------------------------------------
 * Delete Theatre
 * ----------------------------------------------------
 */
const deleteTheatre = async (req, res, next) => {
    try {
        const theatreId = req.params.theatreId;

        if (!theatreId) {
            throw new AppError(400, "INVALID_ID", "Invalid theatre ID");
        }
        const deletedTheatre = await Theatre.findByIdAndDelete(theatreId);

        if (!deletedTheatre) {
            throw new AppError(404, "THEATRE_NOT_FOUND", "Theatre not found");
        }

        res.status(200).json({
            success: true,
            message: "Theatre deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};

/**
 * ----------------------------------------------------
 * Get All Theatres
 * ----------------------------------------------------
 */
const getAllTheatres = async (req, res, next) => {
    try {
        const allTheatres = await Theatre.find().populate({
            path: "owner",
            select: "-password", // explicitly remove sensitive data
        });

        res.send({
            success: true,
            message: "All theatres fetched successfully",
            data: allTheatres,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * ----------------------------------------------------
 * Get All Theatres by Owner
 * ----------------------------------------------------
 */
const getAllTheatresByOwner = async (req, res, next) => {
    try {
        const allTheatres = await Theatre.find({ owner: req.user.userId });

        res.send({
            success: true,
            message: "All theatres fetched for owner",
            data: allTheatres,
        })
    } catch (err) {
        next(err);
    }
};

module.exports = {
    addTheatre,
    updateTheatre,
    deleteTheatre,
    getAllTheatres,
    getAllTheatresByOwner,
};