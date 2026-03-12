import { getAllBookings } from "../api/booking";
import { Button, Card, Col, Row, message, Empty, Tag } from "antd";
import { useEffect, useState } from "react";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { useDispatch } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import { mapErrorToMessage } from "../utils/errorMapper";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      dispatch(showLoading());

      const response = await getAllBookings();
      setBookings(response.data);

    } catch (error) {
      message.error(mapErrorToMessage(error));
    } finally {
      dispatch(hideLoading());
    }
  };

  
  if (!bookings.length) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Empty description="No bookings yet" />
        <Link to="/">
          <Button type="primary" size="large">
            Start Booking
          </Button>
        </Link>
      </div>
    );
  }


   return (
    <div>
      <h2 style={{ marginBottom: "var(--space-5)" }}>
        My Bookings
      </h2>

      <Row gutter={[24, 32]}>
        {bookings
          .filter((b) => b.show)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((booking) => (
            <Col key={booking._id} xs={24} md={12}>
              <Card
                className="movie-surface-card"
                variant="borderless"
                style={{
                  borderRadius: 16,
                }}
              >
                <div style={{ display: "flex", gap: "var(--space-4)" }}>
                  
                  {/* Poster */}
                  <img
                    src={booking.show?.movie?.poster}
                    alt={booking.show?.movie?.movieName}
                    style={{
                      width: 110,
                      height: 160,
                      objectFit: "cover",
                      borderRadius: 12,
                    }}
                  />

                  {/* Details */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: 6 }}>
                      {booking.show?.movie?.movieName}
                    </h3>

                    <p style={{ marginBottom: 4 }}>
                      {booking.show?.theatre?.name}
                    </p>

                    <p style={{ marginBottom: 4 }}>
                      {moment(booking.show.date).format("MMM Do YYYY")} •{" "}
                      {moment(booking.show.time, "HH:mm").format("hh:mm A")}
                    </p>

                    <p style={{ marginBottom: 8 }}>
                      Seats:{" "}
                      <Tag color="blue">
                        {booking.seats.join(", ")}
                      </Tag>
                    </p>

                    <p style={{ marginBottom: 4 }}>
                      <strong>
                        ₹{(booking.amount / 100).toFixed(2)}
                      </strong>
                    </p>

                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        margin: 0,
                      }}
                    >
                      Booking ID: {booking.transactionId}
                    </p>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  );
};


export default MyBookings;