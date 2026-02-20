const { z } = require("zod");

/**
 * Validate Create Payment Intent Request
 * Frontend now sends showId + seats (NOT amount)
 */
const createPaymentIntentSchema = z.object({
  body: z.object({
    showId: z
      .string()
      .length(24, "Invalid showId format"), // Mongo ObjectId length

    seats: z
      .array(z.number().int().positive())
      .min(1, "At least one seat must be selected"),
  }),
});


/**
 * Validate Final Booking Request
 * This is called AFTER Stripe payment succeeds
 */
const bookingSchema = z.object({
  body: z.object({
    show: z.string().length(24, "Invalid showId format"),

    seats: z
      .array(z.number().int().positive())
      .min(1, "At least one seat must be selected"),

    paymentIntentId: z.string().min(1, "Missing paymentIntentId"),
  }),
});


module.exports = {
  createPaymentIntentSchema,
  bookingSchema,
};
