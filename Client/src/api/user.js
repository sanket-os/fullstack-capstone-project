import { axiosInstance } from ".";

// You’re defining an async function named RegisterUser that sends registration data to your backend API.

export const RegisterUser = async (values) => {
    try {
        const response = await axiosInstance.post("/users/register", values);
        return response.data; 
        // extracts only the useful payload (the data the backend sends), not the full Axios response object
    } catch (error) {
        return error;
    }
    // } catch (error) {
    //      return error.response?.data || { success: false, message: error.message };
    // }
    // this is best practice to read an actual error from the backend
};

// The values argument contains form data (like name, email, password, etc.)
export const LoginUser = async (values) => {
    try {
        const response = await axiosInstance.post("/users/login", values);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const GetCurrentUser = async () => {
    try {
        const response = await axiosInstance.get("/users/getCurrentUser");
        return response.data;
    } catch (error) {
        return error;
    }
};

// Reusable and readable.
// All API logic stays separate from your React components.
// Easy to maintain — if the API base URL changes, you update only once in axiosInstance.
// Easier to handle authentication (like adding JWTs) globally later.