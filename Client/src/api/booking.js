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

export const bookShow = async (payload) => {
    try {
        const response = await axiosInstance.post("/bookings/bookShow", payload);
        console.log(response.data);
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

// export const makePaymentAndBookShow = async (payload) => {
//   try {
//     const response = await axiosInstance.post(
//       "/bookings/makePaymentAndBookShow",
//       payload
//     );
//     return response.data;
//   } catch (err) {
//     return err.response;
//   }
// };