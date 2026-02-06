const stripe = require("stripe")(process.env.STRIPE_KEY);
const mongoose = require("mongoose");
const Booking = require("../models/bookingSchema");
const Show = require("../models/showSchema");
const emailHelper = require("../utils/emailHelper");

/**
 * ----------------------------------------------------
 * Create Stripe Payment Intent
 * ----------------------------------------------------
 * Frontend confirms payment using Stripe PaymentElement.
 * Backend responsibility: create intent only.
 */
const createPaymentIntent = async (req, res, next) => {
  try {
    const { amount } = req.body;

     if (!amount || amount <= 0) {
      res.status(400);
      throw new Error("Invalid payment amount");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      // Amount comes from frontend
      // Must be in smallest currency unit
      // ₹500 → 50000 paise
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const transactionId = paymentIntent.id;

    res.send({
      success: true,
      clientSecret: paymentIntent.client_secret,
      // frontend uses with <PaymentElement />, it completes only THIS payment, no create/refund payments
      data: paymentIntent.id,
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    next(error);
  }
};

// auto payment method => UPI, NetBanking, Card
// frontend uses clientSecret to show Stripe payment UI 
// it is used to complete one specific payment on frontend
// it is not same as secretKey

// secretKey => manage stripe, create payment intent, refunds
// client secret => complete a specific payment only

/**
 * ----------------------------------------------------
 * Get All Bookings for Logged-in User
 * ----------------------------------------------------
 */
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.body.userId })
      // Fetch bookings only for logged-in user
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "movies",
        },
      })
      .populate({
        path: "show",
        populate: {
          path: "theatre",
          model: "theatres",
        },
      });
    res.send({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

/**
 * ----------------------------------------------------
 * Make Payment & Book Show (Atomic Operation)
 * ----------------------------------------------------
 * Guarantees:
 * - Payment verified
 * - Seats locked atomically
 * - Booking created transactionally
 */
const makePaymentAndBookShow = async (req, res, next) => {
  // MongoDB session allows us to group multiple DB operations
  // into a single atomic transaction (all succeed or all fail)
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      show: showId,
      seats,
      paymentIntentId, // payment already created & confirmed on frontend
      user, // injected by auth middleware
    } = req.body;

    if (!showId || !seats?.length || !paymentIntentId || !user) {
      res.status(400);
      throw new Error("Missing required booking details");
    }

    /**
     * STEP 1: Idempotency check
     * Prevent duplicate booking for same paymentIntent
     */
    const existingBooking = await Booking.findOne({
      transactionId: paymentIntentId,
    });

    if (existingBooking) {
      res.status(409);
      throw new Error("Duplicate booking attempt detected");
    }

    /**
     * STEP 2: Verify payment with Stripe
     * ----------------------------------
     * We NEVER charge the card again here.
     * The frontend already confirmed the payment using Stripe PaymentElement.
     * Backend responsibility = verify payment status.
     */
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Stripe payment must be "succeeded" before proceeding
    if (paymentIntent.status !== "succeeded") {
      res.status(400);
      throw new Error("Payment not successful");
    }

    /**
     * STEP 3: Atomically lock seats
     * ------------------------------
     * This query does TWO things at once:
     * 1. Checks that none of the requested seats are already booked
     * 2. If they are free, pushes them into bookedSeats
     *
     * Why `$nin`?
     * - `$nin` ensures none of the requested seats exist in bookedSeats
     * - If even ONE seat is booked, the update fails (returns null)
     *
     * This prevents race conditions in concurrent bookings
     * Because this checks the data in DB & not in Node.js memory which creates race conditions
     * and collisions under high traffic by double booking
     * It works best in high traffic
     * 
     * Transactions do not serialize reads, Transactions ≠ locks
     * Only the database can safely decide who wins.
     */
    const show = await Show.findOneAndUpdate(  // Show.findOneAndUpdate(filter, update, options)
      {
        _id: showId,
        bookedSeats: { $nin: seats },  // $nin means None of these values should be present 
      },
      {
        $push: { bookedSeats: { $each: seats } },   // push & $each Adds multiple items at once
      },
      {
        new: true,   // return updated document
        session,    // bind this update to the transaction
      }
    );

    // If show is null → at least one seat was already booked
    if (!show) {
      res.status(409); // Conflict
      throw new Error("One or more seats already booked");
    }

    /**
     * STEP 4: Create booking document
     * --------------------------------
     * We store Stripe's paymentIntent.id as transactionId
     * This acts as:
     * - payment reference
     * - refund reference
     * - audit trail
     */
    const booking = new Booking({
      user,
      show: showId,
      seats,
      transactionId: paymentIntent.id,
      amount: paymentIntent.amount, // stored in smallest currency unit
      paymentStatus: paymentIntent.status,
    });

    await booking.save({ session });

    /**
     * STEP 5: Populate booking for frontend + email
     * ----------------------------------------------
     * We re-fetch the booking so that:
     * - user details
     * - movie
     * - theatre
     * are fully populated
     */
    const populatedBooking = await Booking.findById(booking._id)
      .populate({ path: "user", select: "-password" })
      .populate({
        path: "show",
        populate: [
          { path: "movie", model: "movies" },
          { path: "theatre", model: "theatres" },
        ],
      })
      .session(session);

    /**
     * STEP 6: Commit transaction
     * ---------------------------
     * At this point:
     * - seats are locked
     * - booking is saved
     * If commit succeeds, data is permanently written.
     */
    await session.commitTransaction();
    session.endSession();

    /**
     * STEP 7: Send email (non-blocking)
     * ---------------------------------
     * Email failures should NOT affect booking success.
     * Hence, we do not await this.
     */
    emailHelper("ticketTemplate.html", populatedBooking.user.email, {
      name: populatedBooking.user.name,
      movie: populatedBooking.show.movie.movieName,
      theatre: populatedBooking.show.theatre.name,
      date: populatedBooking.show.date,
      time: populatedBooking.show.time,
      seats: populatedBooking.seats,
      amount: populatedBooking.amount / 100, // convert paise → rupees
      transactionId: populatedBooking.transactionId,
    }).catch(console.error);

    res.send({
      success: true,
      message: "Payment and booking successful",
      data: populatedBooking,
    });

  } catch (error) {
    /**
     * Any error → rollback all DB operations
     * Ensures no partial booking or seat lock happens
     */
    await session.abortTransaction();
    session.endSession();

    /**
     * Optional improvement:
     * If seat conflict occurs after payment,
     * we can trigger Stripe refund here.
     */
    // if (error.message.includes("already booked")) {
    //   await stripe.refunds.create({ payment_intent: paymentIntentId });
    // }

    res.status(400);
    next(error);
  }
};



module.exports = {
  createPaymentIntent,
  getAllBookings,
  makePaymentAndBookShow,
};