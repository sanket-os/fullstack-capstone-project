import axios from "axios";

// you are using axios here to make API calls to backend e.g. POST, PUT, GET & DELETE etc

// we create a baseURL here for easy maintenance, reusability  
// we use default header for json type of data to communicate with the backend   

// it is a best practice for larger apps & keeps code clean

export const axiosInstance = axios.create({
  baseURL: "/bms/v1",
  withCredentials: true, // REQUIRED FOR COOKIES
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {

    /**
    * 📦 Standardized Backend Error
    */
    const backendError = error?.response?.data?.error;

    if (backendError) {
      return Promise.reject({
        code: backendError.code || "API_ERROR",
        message: backendError.message || "Something went wrong",
      });
    }

    /**
    * 🌐 Network / Unknown Error
    */
    return Promise.reject({
      code: "NETWORK_ERROR",
      message: error.message || "Network error. Please try again.",
    });
  }
);

axiosInstance.interceptors.request.use((config) => {
  // Helpful while testing booking/payment flow
  console.debug("API Request:", config.method?.toUpperCase(), config.url, config.data);
  return config;
});

// when you make an get or post request using axios, it builds
// an internal configuration obj called config that tells how to send the req
// this obj is then passed through the interceptors which can inspect, add or modify
// things before req goes out


// config.url, config.baseURL, config.method, config.headers, config.data,
// config.params, config.timeout
// these are the few details where you can inspect and modify your request before sending it

