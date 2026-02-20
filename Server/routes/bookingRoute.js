const {
  createPaymentIntent,
  getAllBookings,
  makePaymentAndBookShow,
} = require("../controllers/bookingController");

const { allowRoles } = require("../middlewares/roleMiddleware");
const { validateJWTToken } = require("../middlewares/authorizationMiddleware");

const validateRequest = require("../middlewares/validateRequest");

const {
  createPaymentIntentSchema,
  bookingSchema,
} = require("../validators/booking.schema");

const router = require("express").Router();

/**
 * Create Stripe PaymentIntent
 * ---------------------------
 * Used by frontend to initiate payment.
 * Returns clientSecret for Stripe PaymentElement.
 */
router.post("/createPaymentIntent", 
  validateJWTToken,
  allowRoles("user"),
  validateRequest(createPaymentIntentSchema),
  createPaymentIntent
);


/**
 * Get all bookings for logged-in user
 * -----------------------------------
 * JWT-protected (middleware applied at app level)
 */
router.get(
  "/getAllBookings",
  validateJWTToken,
  allowRoles("user"),
  getAllBookings
);

/**
 * Make payment verification + book show
 * -------------------------------------
 * Modern Stripe flow:
 * 1. Frontend confirms payment via PaymentElement
 * 2. Backend verifies paymentIntent
 * 3. Seats are locked atomically
 * 4. Booking is created
 */
router.post(
  "/makePaymentAndBookShow",
  validateJWTToken,
  allowRoles("user"),
  validateRequest(bookingSchema),
  makePaymentAndBookShow
);

module.exports = router;
