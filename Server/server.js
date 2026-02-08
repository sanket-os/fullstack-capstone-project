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
const cookieParser = require("cookie-parser");


const app = express();

/**
 * ----------------------------------------------------
 * Environment Validation (Fail Fast)
 * ----------------------------------------------------
 */

if (!process.env.PORT || !process.env.SECRET_KEY || !process.env.MONGO_URI) {
  console.error("❌ Missing required environment variables");
  process.exit(1);
}

/**
 * ----------------------------------------------------
 * Serve Frontend (React build)
 * ----------------------------------------------------
 */
app.use(express.static(path.join(__dirname, "../Client/dist")));

// we have included the distribution folder by npm run build command on the frontend side
// with the help of dist folder we do static rendering on backend as shown above
// build cmd turns code into compiled, optimized, bundled & minified form
// we do static rendering and client side rendering here 

// These files are static and can be served by Nginx, Render, Netlify, S3, etc.  
// If the browser asks for a file, check the dist folder and send it.


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
      upgradeInsecureRequests: [], // Automatically upgrades HTTP requests to HTTPS
    },
  })
);


/**
 * ----------------------------------------------------
 * CORS Configuration (Restricted)
 * ----------------------------------------------------
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    // origin: true,
    credentials: true,
  })
);

/**
 * Body parser
 */
app.use(express.json());
app.use(cookieParser());

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
 * Rate limiter (API only)
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
app.use("/bms/v1", apiLimiter);

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

/**
 * ----------------------------------------------------
 * Centralized Error Handler
 * ----------------------------------------------------
 */
app.use(errorHandler); // Centralized error handler

/**
 * ----------------------------------------------------
 * SPA Fallback (React Router)
 * ----------------------------------------------------
 */
app.get(/.*/, (req, res) => {
  res.sendFile(
    path.join(__dirname, "../Client/dist/index.html")
  );
});
// “If the request is not a file and not an API, send index.html anyway.” 
// React Router decides what UI to show
// This line is needed because React Router runs in the browser, not on the server.

// express.static serves the built frontend assets, and the (/.*/) regex fallback ensures
//  all non-API routes return index.html so React Router can handle client-side routing.

// The server will first check if the dot environment variable is set. 
// If it is, the server will use that value.
// it is helpful to configure it in different environments like development, staging, production 

/**
 * ----------------------------------------------------
 * Start Server ONLY After DB Connection
 * ----------------------------------------------------
 */

connectDB()
  .then(() => {
    const server = app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("🛑 SIGTERM received. Shutting down gracefully...");
      server.close(() => process.exit(0));
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed", err);
    process.exit(1);
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