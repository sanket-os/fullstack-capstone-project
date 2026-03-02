import { Card, Button, Divider } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const BookingSuccess = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const booking = state?.booking;

  if (!booking) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "var(--space-6) var(--space-3)",
      }}
    >
      <Card
        bordered={false}
        style={{
          maxWidth: 640,
          width: "100%",
          borderRadius: 16,
          textAlign: "center",
        }}
      >
        {/* Success Header */}
        <div style={{ marginBottom: "var(--space-4)" }}>
          <CheckCircleFilled
            style={{
              fontSize: 48,
              color: "var(--primary)",
              marginBottom: "var(--space-3)",
            }}
          />

          <h2 style={{ marginBottom: 4 }}>
            Booking Confirmed
          </h2>

          <p style={{ margin: 0 }}>
            Your seats are successfully reserved.
          </p>
        </div>

        <Divider />

        {/* Booking Details */}
        <div
          style={{
            textAlign: "left",
            marginBottom: "var(--space-5)",
            fontSize: 14,
          }}
        >
          <p><strong>Movie:</strong> {booking.show.movie.movieName}</p>

          <p><strong>Theatre:</strong> {booking.show.theatre.name}</p>

          <p>
            <strong>Date & Time:</strong>{" "}
            {moment(booking.show.date).format("MMM Do YYYY")} at{" "}
            {moment(booking.show.time, "HH:mm").format("hh:mm A")}
          </p>

          <p><strong>Seats:</strong> {booking.seats.join(", ")}</p>

          <p>
            <strong>Amount Paid:</strong> ₹ {booking.amount / 100}
          </p>

          <p>
            <strong>Transaction ID:</strong> {booking.transactionId}
          </p>
        </div>

        <Divider />

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
            flexDirection: "column",
          }}
        >
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/mybookings")}
          >
            View My Bookings
          </Button>

          <Button
            size="large"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BookingSuccess;