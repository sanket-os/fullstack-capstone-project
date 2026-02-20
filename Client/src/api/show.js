import { axiosInstance } from ".";

export const addShow = async (payload) => {
    const response = await axiosInstance.post("/shows/addShow", payload);
    return response.data;
};

export const updateShow = async (payload) => {
    const response = await axiosInstance.patch("/shows/updateShow", payload);
    return response.data;
};

export const deleteShow = async (payload) => {
    const response = await axiosInstance.delete(`/shows/deleteShow/${payload.showId}`);
    return response.data;
};

export const getAllShowsByTheatre = async (payload) => {
    const response = await axiosInstance.get(`/shows/getAllShowsByTheatre/${payload.theatreId}`);
    return response.data;
};

export const getAllTheatresByMovie = async (payload) => {
    const response = await axiosInstance.post("/shows/getAllTheatresByMovie", payload);
    return response.data;
};

export const getShowById = async (payload) => {
    const response = await axiosInstance.get(`/shows/getShowById/${payload.showId}`);
    return response.data;
};
