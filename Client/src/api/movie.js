import { axiosInstance } from ".";

export const getAllMovies = async () => {
    const response = await axiosInstance.get("/movies/getAllMovies");
    return response?.data;
};

export const updateMovie = async (payload) => {
    const response = await axiosInstance.patch("/movies/updateMovie", payload);
    return response?.data;

};

export const deleteMovie = async (payload) => {
    const response = await axiosInstance.delete(
        `/movies/deleteMovie/${payload?.movieId}`
    );
    return response?.data;
};

export const addMovie = async (values) => {
    const response = await axiosInstance.post("/movies/addMovie", values);
    return response.data;
};

export const getMovieById = async (id) => {
    const response = await axiosInstance.get(`/movies/movie/${id}`);
    return response.data;
};