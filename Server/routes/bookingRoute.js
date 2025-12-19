const { 
    bookShow, 
    createPaymentIntent,
    getAllBookings,    
    makePaymentAndBookShow,
} = require("../controllers/bookingController");

const router = require("express").Router();

router.post("/createPaymentIntent", createPaymentIntent);
router.post("/bookShow", bookShow);
router.get("/getAllBookings", getAllBookings);
// router.post("/makePaymentAndBookShow", makePaymentAndBookShow);

module.exports = router;