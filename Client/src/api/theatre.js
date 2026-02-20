import { axiosInstance } from ".";

export const addTheatre = async (payload) => {
    const response = await axiosInstance.post("/theatres/addTheatre", payload);
    return response.data;
};

export const updateTheatre = async (payload) => {
    const response = await axiosInstance.patch("/theatres/updateTheatre", payload);
    return response.data;
};

export const getAllTheatres = async () => {
    const response = await axiosInstance.get("/theatres/getAllTheatresByOwner");
    return response.data;
};

export const getAllTheatresForAdmin = async () => {
    const response = await axiosInstance.get("/theatres/getAllTheatres");
    return response.data;
};

export const deleteTheatre = async (payload) => {
    const response = await axiosInstance.delete(
        `/theatres/deleteTheatre/${payload?.theatreId}`
    );
    return response.data;
};