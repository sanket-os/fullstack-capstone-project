import { useEffect, useState } from "react";
import { message, Input, Row, Col, Card, Button } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

import { getMovieById } from "../api/movie";
import { getAllTheatresByMovie } from "../api/show";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { mapErrorToMessage } from "../utils/errorMapper";

const SingleMovie = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [theatres, setTheatres] = useState([]);

  const fetchMovie = async () => {
    try {
      dispatch(showLoading());
      const response = await getMovieById(id);
      setMovie(response.data);
    } catch (error) {
      message.error(mapErrorToMessage(error));
    } finally {
      dispatch(hideLoading());
    }
  };

  const fetchTheatres = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllTheatresByMovie({ movie: id, date });
      setTheatres(response.data);
    } catch (error) {
      message.error(error?.message || "Error loading theatres");
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    navigate(`/movie/${ id } ? date = ${ selectedDate }`);
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  useEffect(() => {
    fetchTheatres();
  }, [date, id]);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* ===== MOVIE HEADER ===== */}
      {movie && (
        <Card
          className="movie-surface-card"
          variant="borderless"
          style={{
            marginBottom: "var(--space-6)",
            borderRadius: 16,
          }}
        >
          <Row gutter={[32, 24]}>
            <Col xs={24} md={8}>
              <img
                src={movie.poster}
                alt="Movie Poster"
                style={{
                  width: "100%",
                  borderRadius: 16,
                  objectFit: "cover",
                }}
              />
            </Col>

            <Col xs={24} md={16}>
              <h1 style={{ marginBottom: 12 }}>
                {movie.movieName}
              </h1>

              <p style={{ marginBottom: 6 }}>
                <strong>Language:</strong> {movie.language.join(", ")}
              </p>

              <p style={{ marginBottom: 6 }}>
                <strong>Genre:</strong> {movie.genre.join(", ")}
              </p>

              <p style={{ marginBottom: 6 }}>
                <strong>Release Date:</strong>{" "}
                {moment(movie.releaseDate).format("MMM Do YYYY")}
              </p>

              <p style={{ marginBottom: 16 }}>
                <strong>Duration:</strong> {movie.duration} Minutes
              </p>

              <div style={{ maxWidth: 260 }}>
                <Input
                  type="date"
                  min={moment().format("YYYY-MM-DD")}
                  value={date}
                  onChange={handleDateChange}
                  prefix={<CalendarOutlined />}
                />
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* ===== EMPTY STATE ===== */}
      {theatres.length === 0 && (
        <Card className="movie-surface-card" variant="borderless">
          <h3 style={{ margin: 0 }}>
            Currently no theatres available for this movie.
          </h3>
        </Card>
      )}

      {/* ===== THEATRES ===== */}
      {theatres.length > 0 && (
        <div>
          <h2 style={{ marginBottom: "var(--space-4)" }}>
            Theatres
          </h2>
          {theatres.map((theatre) => (
            <Card
              className="movie-surface-card"
              key={theatre._id}
              variant="borderless"
              style={{
                marginBottom: "var(--space-5)",
                borderRadius: 16,
              }}
            >
              <Row gutter={[24, 16]}>
                <Col xs={24} md={8}>
                  <h3 style={{ marginBottom: 4 }}>
                    {theatre.name}
                  </h3>
                  <p style={{ margin: 0 }}>
                    {theatre.address}
                  </p>
                </Col>

                <Col xs={24} md={16}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "var(--space-3)",
                    }}
                  >
                    {[...theatre.shows]
                      .sort(
                        (a, b) =>
                          moment(a.time, "HH:mm") -
                          moment(b.time, "HH:mm")
                      )
                      .map((show) => (
                        <Button
                          key={show._id}
                          shape="round"
                          size="middle"
                          onClick={() =>
                            navigate(`/book-show/${ show._id }`)
                          }
                          style={{
                            minWidth: 90,
                            fontWeight: 500,
                          }}
                        >
                          {moment(show.time, "HH:mm").format("hh:mm A")}
                        </Button>
                      ))}
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleMovie;