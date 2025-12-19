const stripe = require("stripe")(process.env.STRIPE_KEY);
const Booking = require("../models/bookingSchema");
const Show = require("../models/showSchema");
const emailHelper = require("../utils/emailHelper");
// const mongoose = require("mongoose");

const createPaymentIntent = async (req, res, next) => {
  try {
    const { amount } = req.body;

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
      data: transactionId,
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


const bookShow = async (req, res, next) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();

    const show = await Show.findById(req.body.show);
    const updatedBookedSeats = [...show.bookedSeats, ...req.body.seats];

    await Show.findByIdAndUpdate(req.body.show, {
      bookedSeats: updatedBookedSeats,
    });

    // ⚠️ This is seat locking logic
    // Prevents double booking

    const populatedBooking = await Booking.findById(newBooking._id)
      // we are re-fetching to populate related data
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

    const metaData = {
      name: populatedBooking.user.name,
      movie: populatedBooking.show.movie.movieName,
      theatre: populatedBooking.show.theatre.name,
      date: populatedBooking.show.date,
      time: populatedBooking.show.time,
      seats: populatedBooking.seats,
      amount: populatedBooking.seats.length * populatedBooking.show.ticketPrice,
      transactionId: populatedBooking.transactionId,
    };
    // metaData is used to replace placeholders in HTML 

    await emailHelper(
      "ticketTemplate.html",
      populatedBooking.user.email,
      metaData
    );

    res.send({
      success: true,
      message: "Payment Successful",
      data: newBooking,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};



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
      message: "Bookings Fetched",
      data: bookings,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};




module.exports = {
  bookShow,
  createPaymentIntent,
  getAllBookings,

};