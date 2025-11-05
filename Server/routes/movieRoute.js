const {
    addMovie,
    getAllMovies,
    updateMovie,
    deleteMovie,
} = require("../controllers/movieController");
// const { validateJWTToken } = require("../middlewares/authorizationMiddleware");

const router = require("express").Router();

// router.post("/addMovie", validateJWTToken, addMovie);
// router.get("/getAllMovies", validateJWTToken, getAllMovies);
// router.patch("/updateMovie", validateJWTToken, updateMovie);
// router.delete("/deleteMovie/:movieId", validateJWTToken, deleteMovie);

router.post("/addMovie", addMovie);
router.get("/getAllMovies", getAllMovies);
router.patch("/updateMovie", updateMovie);
router.delete("/deleteMovie/:movieId", deleteMovie);

module.exports = router;