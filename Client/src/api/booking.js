import { axiosInstance } from ".";

/**
 * ----------------------------------------------------
 * Create Payment Intent
 * ----------------------------------------------------
 * Frontend sends only:
 *   { showId, seats }
 *
 * Backend:
 *   - validates seats
 *   - calculates amount
 *   - creates Stripe PaymentIntent
 *   - returns clientSecret
 */
export const createPaymentIntent = async ({ showId, seats }) => {
  const response = await axiosInstance.post(
    "/bookings/createPaymentIntent",
    {
      showId,
      seats,
    }
  );

  return response.data;
};


export const getAllBookings = async () => {
  const response = await axiosInstance.get("/bookings/getAllBookings");
  return response.data;
};


/**
 * ----------------------------------------------------
 * Make Payment & Finalize Booking
 * ----------------------------------------------------
 * Called AFTER Stripe confirms payment on frontend.
 *
 * Backend will:
 *   - verify paymentIntent with Stripe
 *   - validate metadata (user/show/seats)
 *   - atomically lock seats
 *   - create booking record
 */
export const makePaymentAndBookShow = async ({
  show,
  seats,
  paymentIntentId,
}) => {
  const response = await axiosInstance.post(
    "/bookings/makePaymentAndBookShow",
    {
      show,
      seats,
      paymentIntentId,
    }
  );

  return response.data;
};