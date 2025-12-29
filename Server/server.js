const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

require("dotenv").config();

const connectDB = require("./config/db");

const userRoute = require("./routes/userRoute");
const movieRoute = require("./routes/movieRoute");
const theatreRoute = require("./routes/theatreRoute");
const showRoute = require("./routes/showRoute");
const bookingRoute = require("./routes/bookingRoute");

const errorHandler = require("./middlewares/errorHandler");
const { validateJWTToken } = require("./middlewares/authorizationMiddleware");
const cors = require("cors");
const path = require("path");


const app = express();

const clientBuildPath = path.join(__dirname, "../Client/dist");
app.use(express.static(clientBuildPath));


connectDB();


/**
 * Security middlewares
 * --------------------
 * Helmet sets HTTP security headers
 */
app.use(helmet());

// Custom Content Security Policy (CSP) configuration
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"], // Allows resources from the same origin (https://bookmyshowjune2024.onrender.com)
//       scriptSrc: ["'self'"], // Allows scripts from your own domain
//       styleSrc: ["'self'", "'unsafe-inline'"], // Allows styles from your domain and inline styles (if needed)
//       imgSrc: ["'self'", "data:"], // Allows images from your domain and base64-encoded images
//       connectSrc: ["'self'"], // Allows AJAX requests to your own domain
//       fontSrc: ["'self'"], // Allows fonts from your domain
//       objectSrc: ["'none'"], // Disallows <object>, <embed>, and <applet> elements
//       upgradeInsecureRequests: [], // Automatically upgrades HTTP requests to HTTPS
//     },
//   })
// );

/**
 * Custom Content Security Policy
 * ------------------------------
 * Allows Stripe, frontend, and API communication safely
 */
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://js.stripe.com", // Stripe JS
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // required for Stripe styles
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https://*.stripe.com",
      ],
      connectSrc: [
        "'self'",
        "https://api.stripe.com", // Stripe API
      ],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
    },
  })
);
/**
 * Body parser
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Prevent MongoDB operator injection (SAFE for Node 18+)
 * ------------------------------------------------------
 * Sanitizes only req.body to avoid mutating req.query,
 * which is read-only in modern Node versions.
 */
app.use((req, res, next) => {
  // Sanitize body (can reassign)
  if (req.body && typeof req.body === "object") {
    req.body = mongoSanitize.sanitize(req.body); // replace $ with _ => literal string not mongoDB operator
  }

  // Sanitize query & params (can't reassign, so sanitize in-place)
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (key.includes('$')) {
        const newKey = key.replace(/\$/g, '_');
        req.query[newKey] = req.query[key];
        delete req.query[key];
      }
    });
  }
  next();
});

/**
 * Rate limiter
 * -------------
 * Limits repeated requests from same IP
 * Protects login & booking endpoints from abuse
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
});

/**
 * Apply rate limiting to API routes only
 */
app.use("/bms", apiLimiter);

/**
 * Public routes (no JWT required)
 */
app.use("/bms/v1/users", userRoute);

// always remember to use ( / ) at the start of endpoint 

// Authentication lifecycle (IMPORTANT)
// Correct flow
// 1️⃣ Register / Login (NO TOKEN)
// 2️⃣ Backend creates JWT
// 3️⃣ Frontend stores token
// 4️⃣ Protected routes use token

// So:

// Route type	        Needs token?
// Register	            ❌
// Login	              ❌
// Forgot password	    ❌
// Verify OTP	          ❌
// Reset password	      ❌
// Get current user 	  ✅

/**
 * Protected routes (JWT required)
 */
app.use("/bms/v1/movies", validateJWTToken, movieRoute);
app.use("/bms/v1/theatres", validateJWTToken, theatreRoute);
app.use("/bms/v1/shows", validateJWTToken, showRoute);
app.use("/bms/v1/bookings", validateJWTToken, bookingRoute);

app.use(errorHandler); // Centralized error handler

// The server will first check if the dot environment variable is set. 
// If it is, the server will use that value.
// it is helpful to configure it in different environments like development, staging, production 

// Start server
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