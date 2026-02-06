const Theatre = require("../models/theatreSchema");

/**
 * ----------------------------------------------------
 * Add Theatre (Admin / Owner)
 * ----------------------------------------------------
 */
const addTheatre = async (req, res, next) => {
    try {
          if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400);
      throw new Error("Theatre details are required");
    }

        const newTheatre = new Theatre(req.body);
        await newTheatre.save();

        res.send({
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
      res.status(400);
      throw new Error("theatreId is required");
    }

    const updatedTheatre = await Theatre.findByIdAndUpdate(
      theatreId,
      updateData,
      { new: true }
    );

    if (!updatedTheatre) {
      res.status(404);
      throw new Error("Theatre not found");
    }

        res.send({
            success: true,
            message: "Theatre updated successfully",
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
        const deletedTheatre = await Theatre.findByIdAndDelete(theatreId);

    if (!deletedTheatre) {
      res.status(404);
      throw new Error("Theatre not found");
    }

        res.send({
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
    res.status(500);
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
        const allTheatres = await Theatre.find({ owner: req.body.userId });

        res.send({
            success: true,
            message: "All theatres fetched for owner",
            data: allTheatres,
        })
    } catch (err) {
        res.status(500);
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