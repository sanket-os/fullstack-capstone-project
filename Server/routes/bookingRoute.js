const { 
    bookShow, 
    createPaymentIntent,
    getAllBookings,    
} = require("../controllers/bookingController");

const router = require("express").Router();

router.post("/createPaymentIntent", createPaymentIntent);
router.post("/bookShow", bookShow);
router.get("/getAllBookings", getAllBookings);

module.exports = router;