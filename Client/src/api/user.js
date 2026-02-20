import { axiosInstance } from ".";

// You’re defining an async function named RegisterUser that sends registration data to your backend API.

export const RegisterUser = async (values) => {
  const response = await axiosInstance.post("/users/register", values);
  return response.data;
  // extracts only the useful payload (the data the backend sends), not the full Axios response object
};


// The values argument contains form data (like name, email, password, etc.)
export const LoginUser = async (values) => {
  const response = await axiosInstance.post("/users/login", values);
  return response.data;
};

export const GetCurrentUser = async () => {
  const response = await axiosInstance.get("/users/getCurrentUser");
  return response.data;
};

export const ForgetPassword = async (values) => {
  const response = await axiosInstance.post("/users/forgetPassword", values);
  return response.data;
};

export const ResetPassword = async (values) => {
  const response = await axiosInstance.post("/users/resetPassword", values);
  return response.data;
};


// Reusable and readable.
// All API logic stays separate from your React components.
// Easy to maintain — if the API base URL changes, you update only once in axiosInstance.
// Easier to handle authentication (like adding JWTs) globally later.