const { bookShow, createPaymentIntent } = require("../controllers/bookingController");

const router = require("express").Router();

router.post("/createPaymentIntent", createPaymentIntent);
router.post("/bookShow", bookShow);

module.exports = router;