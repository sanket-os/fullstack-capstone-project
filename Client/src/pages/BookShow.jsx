import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Row, Col, Button, message, Steps, Divider } from "antd";
import moment from "moment";

import { getShowById } from "../api/show";
import {
  createPaymentIntent,
  makePaymentAndBookShow,
} from "../api/booking";

import { showLoading, hideLoading } from "../redux/loaderSlice";
import { mapErrorToMessage } from "../utils/errorMapper";

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
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

const BookShow = () => {
  const { id: showId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  /**
   * Stripe-related state
   */
  const [clientSecret, setClientSecret] = useState(null);
  // const [showPaymentUI, setShowPaymentUI] = useState(false);

  useEffect(() => {
    fetchShow();
  }, [showId]);

  /**
   * Fetch show details on page load
   */
  const fetchShow = async () => {
    try {
      dispatch(showLoading());
      const response = await getShowById({ showId });

      setShow(response.data);

    } catch (error) {
      message.error(mapErrorToMessage(error));
    } finally {
      dispatch(hideLoading());
    }
  };



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
      // const amount = selectedSeats.length * show.ticketPrice * 100;
      // const response = await createPaymentIntent(amount);

      const response = await createPaymentIntent({
        showId,
        seats: selectedSeats,
      });

      setClientSecret(response.clientSecret);
      // setShowPaymentUI(true);
      setCurrentStep(1);

    } catch (error) {
      message.error(mapErrorToMessage(error));
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

      let response = await makePaymentAndBookShow({
        show: showId,
        seats: selectedSeats,
        paymentIntentId,
      });

      setCurrentStep(2);

      navigate("/booking-success", {
        state: { booking: response.data }
      });

    } catch (error) {
      message.error(mapErrorToMessage(error));
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
        message.error(mapErrorToMessage(submitError));
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
        message.error(mapErrorToMessage(error));
        return;
      }

      /**
       * Step 2.3: Payment successful → book show
       * Now send paymentIntent.id to backend for verification & booking
       */
      if (paymentIntent.status === "succeeded") {
        await bookAndPay(paymentIntent.id);
      }
    };

    return (
      <form onSubmit={handlePay} style={{ marginTop: "var(--space-4)" }}>
        <PaymentElement />
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          style={{ marginTop: "var(--space-3)" }}
        >
          Pay ₹{selectedSeats.length * show.ticketPrice}
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
      <div style={{ maxWidth: 700, margin: "0 auto" }}>

        <p style={{ textAlign: "center", marginBottom: "var(--space-3)" }}>
          Screen this side — you will be watching in this direction
        </p>

        <div className="screen-div"></div>

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

        <ul className="seat-ul">
          {Array.from({ length: rows }).map((_, row) =>
            Array.from({ length: columns }).map((_, column) => {
              const seatNumber = row * columns + column + 1;
              if (seatNumber > totalSeats) return null;

              const isSelected = selectedSeats.includes(seatNumber);
              const isBooked = show.bookedSeats.includes(seatNumber);

              return (
                <li key={seatNumber}>
                  <button
                    className={`seat ${isSelected ? "seat-selected" : ""
                      } ${isBooked ? "seat-booked" : ""}`}
                    disabled={isBooked || currentStep > 0}
                    onClick={() => {
                      if (currentStep > 0) return; // prevent changes

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
    );
  };

  if (!show) return null;


  return (
    <>
      <div className={`step-container ${currentStep === 0 ? "active" : ""}`}
        style={{
          maxWidth: 800,
          margin: "var(--space-6) auto var(--space-7)"
        }}
      >
        <Steps
          size="small"
          current={currentStep}
          items={[
            { title: "Select Seats" },
            { title: "Payment" },
            { title: "Confirmation" },
          ]}
        />
      </div>

      <Row justify="center">
        <Col xs={24} lg={22}>
          <Card
            bordered={false}
            style={{ borderRadius: 16 }}
            title={
              <>
                <h2 style={{ marginBottom: 4 }}>
                  {show.movie.movieName}
                </h2>
                <p style={{ margin: 0 }}>
                  {show.theatre.name} —{" "}
                  {moment(show.date).format("MMM Do YYYY")} •{" "}
                  {moment(show.time, "HH:mm").format("hh:mm A")}
                </p>
              </>
            }
          >

            {/* STEP 0 — Seat Selection */}
            {currentStep === 0 && renderSeats()}

            {/* STEP 1 — Checkout Layout */}
            {currentStep === 1 && (
              <div className="fade-step">
                <Row gutter={[32, 32]}>

                  {/* LEFT COLUMN — SUMMARY */}
                  <Col xs={24} md={10}>
                    <div
                      style={{
                        background: "#f9fafb",
                        padding: "var(--space-4)",
                        borderRadius: 16,
                      }}
                    >
                      <h3>Selected Seats</h3>
                      <p style={{ marginBottom: 8 }}>
                        {selectedSeats.join(", ")}
                      </p>

                      <Divider />

                      <h3>
                        Total: ₹ {selectedSeats.length * show.ticketPrice}
                      </h3>

                      <Button
                        type="default"
                        block
                        style={{ marginTop: "var(--space-3)" }}
                        onClick={() => {
                          setClientSecret(null);
                          setCurrentStep(0);
                        }}
                      >
                        ← Back to Seat Selection
                      </Button>
                    </div>
                  </Col>

                  {/* RIGHT COLUMN — PAYMENT */}
                  <Col xs={24} md={14}>
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <PaymentSection />
                    </Elements>
                  </Col>
                </Row>
              </div>
            )}

            {/* STEP 0 CTA */}
            {currentStep === 0 && selectedSeats.length > 0 && (
              <Button
                type="primary"
                size="large"
                block
                style={{ marginTop: "var(--space-4)" }}
                onClick={createIntent}
              >
                Proceed to Payment
              </Button>
            )}

          </Card>
        </Col>
      </Row>
    </>
  );
};

export default BookShow;
