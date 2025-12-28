import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Row, Col, Button, message } from "antd";
import moment from "moment";

import { getShowById } from "../api/show";
import {
  createPaymentIntent,
  makePaymentAndBookShow,
} from "../api/booking";

import { showLoading, hideLoading } from "../redux/loaderSlice";

/**
 * Stripe imports
 */
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
// loadStripe connects your frontend with Stripe account using your publishable key.
// This returns a promise that gives access to Stripe’s client library 

/**
 * loadStripe initializes Stripe using your publishable key.
 * This does NOT expose secret keys.
 */
const stripePromise = loadStripe(
  "pk_test_51SUR6c1hxLR6U0W4MAayKKnxh4MEOIpIPFin0JI5ZCNUQ4pFjAO1gdAEIPcTpciWQMDTXDcE4qvupwZizEhSSD5t00yQi4EjTt"
);

const BookShow = () => {
  const { id: showId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  /**
   * Stripe-related state
   */
  const [clientSecret, setClientSecret] = useState(null);
  const [showPaymentUI, setShowPaymentUI] = useState(false);

  /**
   * Fetch show details on page load
   */
  const fetchShow = async () => {
    try {
      dispatch(showLoading());
      const response = await getShowById({ showId });
      if (response.success) {
        setShow(response.data);
      } else {
        message.warning(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    fetchShow();
  }, []);

  /**
   * STEP 1: Create Stripe PaymentIntent
   * -----------------------------------
   * Backend returns clientSecret
   * Stripe PaymentElement uses clientSecret to render payment UI
   */
  const createIntent = async () => {
    try {
      dispatch(showLoading());

      // Stripe requires amount in smallest currency unit (paise)
      const amount = selectedSeats.length * show.ticketPrice * 100;

      const response = await createPaymentIntent(amount);

      if (response.success) {
        setClientSecret(response.clientSecret);
        setShowPaymentUI(true);
      } else {
        message.warning(response.message || "Failed to initialize payment");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  /**
   * STEP 3: Call backend to verify payment and book show
   * ----------------------------------------------------
   * Backend:
   * - verifies paymentIntent
   * - locks seats atomically
   * - creates booking
   */

  const bookAndPay = async (paymentIntentId) => {
    try {
      dispatch(showLoading());

      const response = await makePaymentAndBookShow({
        show: showId,
        seats: selectedSeats,
        paymentIntentId,
        user: user._id,
      });

      if (response.success) {
        message.success("Show booked successfully!");
        navigate("/mybookings");
      } else {
        message.warning(response.message || "Booking failed");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  /**
   * Stripe Payment UI Component
   * ---------------------------
   * Handles:
   * - Card
   * - UPI
   * - Netbanking
   */

  // Elements wraps your checkout so Stripe works, Makes Stripe available to all child components

  // PaymentElement shows payment UI (card, UPI, netbanking, etc). So you don’t have to build UI manually

  // useStripe() - A React hook that gives you the Stripe object needed to confirm payments, a Stripe instance.

  // useElements() - A React hook that gives access to the form elements (like PaymentElement).

  // stripe.confirmPayment() completes the payment.

  const PaymentSection = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handlePay = async (e) => {
      e.preventDefault();

      // Stripe not ready yet
      if (!stripe || !elements) return;

      /**
       * Step 2.1: Validate user input
       */
      const { error: submitError } = await elements.submit();
      if (submitError) {
        message.error(submitError.message);
        return;
      }

      /**
       * Step 2.2: Confirm payment with Stripe
       * This contacts Stripe servers and completes payment
       */
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required", // prevents full page redirect
      });

      if (error) {
        message.error(error.message);
        return;
      }

      /**
       * Step 2.3: Payment successful → book show
       * Now send paymentIntent.id to backend for verification & booking
       */
      if (paymentIntent.status === "succeeded") {
        message.success("Payment successful");
        await bookAndPay(paymentIntent.id);
      }
    };

    return (
      <form onSubmit={handlePay}>
        <PaymentElement />
        <Button
          type="primary"
          htmlType="submit"
          block
          style={{ marginTop: 20 }}
        >
          Pay Now
        </Button>
      </form>
    );
  };

  /**
   * Seat layout rendering
   */
  const renderSeats = () => {
    const columns = 12;
    const totalSeats = show.totalSeats;
    const rows = Math.ceil(totalSeats / columns);

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="w-100 max-width-600 mx-auto mb-25px">
          <p className="text-center mb-10px">
            Screen this side — you will be watching in this direction
          </p>

          <div className="screen-div"></div>

          <ul className="seat-ul justify-content-center">
            {/* Array.from(Array(rows).keys()) =>

                     Array(rows) → creates an empty array with rows length
                     Example: if rows = 5, you get:
                     [empty × 5]

                     Array(rows).keys() → returns the indexes of the array
                     Example:
                     [0, 1, 2, 3, 4] (an iterator)

                     Array.from() → converts the iterator into a real array.

                     Final output:
                     [0, 1, 2, ..., rows-1] 

                     same thing happens with columns to create a grid of (rows * columns) 
                    */}
            {Array.from({ length: rows }).map((_, row) =>
              Array.from({ length: columns }).map((_, column) => {
                const seatNumber = row * columns + column + 1;
                if (seatNumber > totalSeats) return null;

                let seatClass = "seat-btn";
                if (selectedSeats.includes(seatNumber)) seatClass += " selected";
                if (show.bookedSeats.includes(seatNumber)) seatClass += " booked";

                return (
                  <li key={seatNumber}>
                    <button
                      className={seatClass}
                      onClick={() => {
                        if (seatClass.includes("booked")) return;

                        setSelectedSeats((prev) =>
                          prev.includes(seatNumber)
                            ? prev.filter((s) => s !== seatNumber)
                            : [...prev, seatNumber]
                        );
                      }}
                    >
                      {seatNumber}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div>
      {show && (
        <Row gutter={24}>
          <Col span={24}>
            <Card
              title={
                <div>
                  <h1>{show.movie.movieName}</h1>
                  <p>
                    Theatre: {show.theatre.name}, {show.theatre.address}
                  </p>
                </div>
              }
              extra={
                <div className="py-3">
                  <h3>
                    Date & Time:{" "}
                    {moment(show.date).format("MMM Do YYYY")} at{" "}
                    {moment(show.time, "HH:mm").format("hh:mm A")}
                  </h3>
                  <h3>Ticket Price: ₹{show.ticketPrice}</h3>
                  <h3>
                    Total Seats: {show.totalSeats}
                    <span> &nbsp;|&nbsp; Available Seats: </span>
                    {/* &nbsp; stands for:
                          Non-Breaking Space
                          It is a special HTML character used when you want to add a space that the browser will not collapse or break across lines. 
                          Total Seats: 50 | Available Seats: 20 
                        */}
                    {show.totalSeats - show.bookedSeats.length}
                  </h3>
                </div>
              }
            >
              {renderSeats()}

              {selectedSeats.length > 0 && !showPaymentUI && (
                <div className="max-width-600 mx-auto">
                  <Button
                    type="primary"
                    shape="round"
                    size="large"
                    block
                    onClick={createIntent}
                  >
                    Proceed to Payment
                  </Button>
                </div>
              )}

              {clientSecret && showPaymentUI && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <div style={{ marginBottom: 20, fontWeight: "bold" }}>
                    Total Payable: ₹{selectedSeats.length * show.ticketPrice}
                  </div>
                  <PaymentSection />
                </Elements>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default BookShow;
