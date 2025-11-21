const stripe = require("stripe")(process.env.STRIPE_KEY);
const Booking = require("../models/bookingSchema");
const Show = require("../models/showSchema");

const createPaymentIntent = async (req, res, next) => {
    try {
        const { amount } = req.body;

        // const customer = await stripe.customers.list({
        //     email: token.email,
        //     limit: 1,
        // });

        // let currCustomer = null;

        // if (customer.data.length > 0) {
        //     currCustomer = customer.data[0];
        // } else {
        //     currCustomer = await stripe.customer.create({
        //         source: token.id,
        //         email: token.email,
        //     });
        // }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "inr",
            automatic_payment_methods: {
                enabled: true,
            },
            // customer: currCustomer.id,
            // payment_method_types: ["card"],
            // receipt_email: token.email,
            // description: "Token has been assigned",
        });

        const transactionId = paymentIntent.id;
        res.send({
            success: true,
            clientSecret: paymentIntent.client_secret,
            data: transactionId,
        });
    } catch (error) {
        console.log(error);
        res.status(400);
        next(error);
    }
};

const bookShow = async (req, res, next) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();

        const show = await Show.findById(req.body.show);
        const updatedBookedSeats = [...show.bookedSeats, ...req.body.seats];

        await Show.findByIdAndUpdate(req.body.show, {
            bookedSeats: updatedBookedSeats,
        });

        res.send({
            success: true,
            message: "Booking Successful",
            data: newBooking,
        });
    } catch (error) {
        res.status(400);
        next(error);
    }
};

module.exports = {
    bookShow,
    createPaymentIntent,
};