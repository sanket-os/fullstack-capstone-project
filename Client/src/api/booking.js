import { axiosInstance } from ".";

export const createPaymentIntent = async (amount) => {
    try {
        const response = await axiosInstance.post("/bookings/createPaymentIntent", {
            amount
        });
        return response.data;
    } catch (err) {
        return err.response.data;
    }
};

export const getAllBookings = async () => {
  try {
    const response = await axiosInstance.get("/bookings/getAllBookings");
    return response.data;
  } catch (err) {
    return err.response;
  }
};

/**
 * Make payment and book show
 * --------------------------
 * This function calls backend API that:
 * 1. Verifies Stripe payment intent
 * 2. Locks seats atomically
 * 3. Creates booking
 */
export const makePaymentAndBookShow = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/bookings/makePaymentAndBookShow",
      payload
    );

    // Always return only the backend data
    return response.data;
  } catch (error) {
    /**
     * Axios wraps server errors inside `error.response`
     * We re-throw a clean error so calling components
     * can handle it using try/catch.
     */
    const message =
      error?.response?.data?.message || "Something went wrong during booking";

    throw new Error(message);
  }
};