import { axiosInstance } from ".";

const handleError = (error) => {
  return error.response?.data || {
    success: false,
    message: error.message,
  };
};

export const addShow = async (payload) => {
    try {
        const response = await axiosInstance.post("/shows/addShow", payload);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const updateShow = async (payload) => {
    try {
        const response = await axiosInstance.patch("/shows/updateShow", payload);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const deleteShow = async (payload) => {
    try {
        const response = await axiosInstance.delete(`/shows/deleteShow/${payload.showId}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const getAllShowsByTheatre = async (payload) => {
    try {
        const response = await axiosInstance.get(`/shows/getAllShowsByTheatre/${payload.theatreId}`);
        return response.data;
    } catch (error) {
        return handleError(error)
    }
};

export const getAllTheatresByMovie = async (payload) => {
    try {
        const response = await axiosInstance.post("/shows/getAllTheatresByMovie", payload);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const getShowById = async (payload) => {
    try {
        const response = await axiosInstance.get(`/shows/getShowById/${payload.showId}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};
