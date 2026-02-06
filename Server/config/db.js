const mongoose = require("mongoose");

/**
 * ----------------------------------------------------
 * Database Connection
 * ----------------------------------------------------
 * Establishes a connection to MongoDB using Mongoose.
 * The connection string is externalized via environment
 * variables to avoid hardcoding sensitive information.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            autoIndex: false, // disable auto index creation in production
        });

        // i have used my mongodb key inside of the .env (environment var file) along with the PORT
        // connection to maintain secrecy about sensitive info and enhance my security, it uses key-val pairs

        // Different .env files can be used for different environments (e.g. development, testing, production) 
        // to manage varying configurations without modifying the codebase

        console.log("MongoDB connection is Successful ");
    } catch (error) {
        console.log("MongoDB connection error ", error);
        process.exit(1); // i am terminating server operations whenever there is a problem with DB connection
    }
};

module.exports = connectDB;