const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const response = await mongoose.connect(
            process.env.MONGODB_CONNECTION
        );
        console.log("MongoDB connection is Successful ");
    } catch(error) {
        console.log("MongoDB connection error ", error);
        process.exit(1); // i am terminating server operations whenever there is a problem with DB connection
    }
};

module.exports = connectDB;