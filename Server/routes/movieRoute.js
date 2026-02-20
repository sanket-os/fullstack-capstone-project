const {
    addMovie,
    getAllMovies,
    updateMovie,
    deleteMovie,
    getMovieById,
} = require("../controllers/movieController");

const { validateJWTToken } = require("../middlewares/authorizationMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");
const { movieSchema } = require("../validators/movie.schema");
const validateRequest = require("../middlewares/validateRequest");

const router = require("express").Router();

router.get("/getAllMovies", getAllMovies);

router.post(
  "/addMovie",
  validateJWTToken,
  allowRoles("admin"),
  validateRequest(movieSchema),
  addMovie
);

router.patch(
  "/updateMovie",
  validateJWTToken,
  allowRoles("admin"),
  updateMovie
);

router.delete(
  "/deleteMovie/:movieId",
  validateJWTToken,
  allowRoles("admin"),
  deleteMovie
);

router.get("/movie/:id", getMovieById);

module.exports = router;