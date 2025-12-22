const {
  createPaymentIntent,
  getAllBookings,
  makePaymentAndBookShow,
} = require("../controllers/bookingController");

const router = require("express").Router();

/**
 * Create Stripe PaymentIntent
 * ---------------------------
 * Used by frontend to initiate payment.
 * Returns clientSecret for Stripe PaymentElement.
 */
router.post("/createPaymentIntent", createPaymentIntent);


/**
 * Get all bookings for logged-in user
 * -----------------------------------
 * JWT-protected (middleware applied at app level)
 */
router.get("/getAllBookings", getAllBookings);

/**
 * Make payment verification + book show
 * -------------------------------------
 * Modern Stripe flow:
 * 1. Frontend confirms payment via PaymentElement
 * 2. Backend verifies paymentIntent
 * 3. Seats are locked atomically
 * 4. Booking is created
 */
router.post("/makePaymentAndBookShow", makePaymentAndBookShow);

module.exports = router;
