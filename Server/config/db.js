const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const response = await mongoose.connect(
            process.env.MONGODB_CONNECTION
        );
        // i have used my mongodb key inside of the .env (environment var file) along with the PORT
        // connection to maintain secrecy about sensitive info and enhance my security, it uses key-val pairs

        // Different .env files can be used for different environments (e.g. development, testing, production) 
        // to manage varying configurations without modifying the codebase

        console.log("MongoDB connection is Successful ");
    } catch(error) {
        console.log("MongoDB connection error ", error);
        process.exit(1); // i am terminating server operations whenever there is a problem with DB connection
    }
};

module.exports = connectDB;