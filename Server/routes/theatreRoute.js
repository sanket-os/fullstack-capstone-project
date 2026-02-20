const { 
    addTheatre,
    updateTheatre,
    deleteTheatre,
    getAllTheatres,
    getAllTheatresByOwner,
} = require("../controllers/theatreController");

const { allowRoles } = require("../middlewares/roleMiddleware");
const { validateJWTToken } = require("../middlewares/authorizationMiddleware");
const { theatreSchema } = require("../validators/theatre.schema");
const validateRequest = require("../middlewares/validateRequest");

const router = require("express").Router();

// Partner creates theatres
router.post(
  "/addTheatre",
  validateJWTToken,
  allowRoles("partner"),
  validateRequest(theatreSchema),
  addTheatre
);

// Admin approves / blocks
router.patch(
  "/updateTheatre",
  validateJWTToken,
  allowRoles("admin", "partner"),
  updateTheatre
);

router.delete("/deleteTheatre/:theatreId", deleteTheatre);
router.get("/getAllTheatres", getAllTheatres);
router.get("/getAllTheatresByOwner", getAllTheatresByOwner);

module.exports = router;