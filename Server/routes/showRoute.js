const {
    addShow,
    deleteShow,
    updateShow,
    getAllShowsByTheatre,
    getAllTheatresByMovie,
    getShowById,
} = require("../controllers/showController");

const { validateJWTToken } = require("../middlewares/authorizationMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");
const { showSchema } = require("../validators/show.schema");
const validateRequest = require("../middlewares/validateRequest");

const router = require("express").Router();

router.post(
  "/addShow",
  validateJWTToken,
  allowRoles("partner"),
  validateRequest(showSchema),
  addShow
);

router.patch(
  "/updateShow",
  validateJWTToken,
  allowRoles("partner"),
  updateShow
);

router.delete(
  "/deleteShow/:showId",
  validateJWTToken,
  allowRoles("partner"),
  deleteShow
);

router.get("/getAllShowsByTheatre/:theatreId", getAllShowsByTheatre);
router.post("/getAllTheatresByMovie", getAllTheatresByMovie);
router.get("/getShowById/:showId", getShowById);

module.exports = router;