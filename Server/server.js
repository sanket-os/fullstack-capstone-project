const express = require("express");
const app = express();

require("dotenv").config();

const connectDB = require("./config/db");

const userRoute = require("./routes/userRoute");
const movieRoute = require("./routes/movieRoute");
const theatreRoute = require("./routes/theatreRoute");
const showRoute = require("./routes/showRoute");
const bookingRoute = require("./routes/bookingRoute");

const errorHandler = require("./middlewares/errorHandler");
const { validateJWTToken } = require("./middlewares/authorizationMiddleware");

connectDB();
app.use(express.json());

app.use("/bms/v1/users", userRoute);
// always remember to use ( / ) at the start of endpoint 

app.use("/bms/v1/movies", validateJWTToken, movieRoute);
app.use("/bms/v1/theatres", validateJWTToken, theatreRoute);
app.use("/bms/v1/shows", validateJWTToken, showRoute);
app.use("/bms/v1/bookings", validateJWTToken, bookingRoute);

app.use(errorHandler);

// The server will first check if the PORT environment variable is set. 
// If it is, the server will use that value.
// it is helpful to configure it in different environments like development, staging, production 

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
});



// process.env is an object that contains the user environment variables (like system 
// settings and configuration values) for the current Node.js process

// note down everything inside of .env file while attending lectures 

// dotenv is a Node.js package that allows you to load environment variables from a 
// special file called .env into process.env.

// ✅ Keeps secrets out of your code
// ✅ Makes deployment easier (different .env files for dev, test, prod)
// ✅ Easy to change configuration without editing code

// process is a global object in Node.js that provides information and control 
// about the current Node.js program (the process that’s running your app).

// You can think of it as a built-in object that represents the environment where
//  your Node.js code is running — including system info, environment variables, and runtime controls.