import axios from "axios";

// you are using axios here to make API calls to backend e.g. POST, PUT, GET & DELETE etc

// we create a baseURL here for easy maintenance, reusability  
// we use default header for json type of data to communicate with the backend   

// it is a best practice for larger apps & keeps code clean

export const axiosInstance = axios.create({
    baseURL: "/bms/v1",
    withCredentials: true, // REQUIRED FOR COOKIES
    headers: {
        "Content-Type" : "application/json",
    },
});

// when you make an get or post request using axios, it builds
// an internal configuration obj called config that tells how to send the req
// this obj is then passed through the interceptors which can inspect, add or modify 
// things before req goes out


// config.url, config.baseURL, config.method, config.headers, config.data, 
// config.params, config.timeout 
// these are the few details where you can inspect and modify your request before sending it

