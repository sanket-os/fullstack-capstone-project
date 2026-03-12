import { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { message, Row, Col, Input, Card, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from '@ant-design/icons';
import moment from "moment";

import { getAllMovies } from "../api/movie";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { mapErrorToMessage } from "../utils/errorMapper";

const { Meta } = Card;

const Home = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [searchText, setSearchText] = useState("");

    useEffect(() => {
    fetchMovies();
  }, []);


  const fetchMovies = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllMovies();

      setMovies(response.data);
    
    } catch (error) {
      message.error(mapErrorToMessage(error));
    } finally {
      dispatch(hideLoading());
    }
  };


  // Memoized filtering for better performance
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) =>
      movie.movieName.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [movies, searchText]);


  const openMovie = (movieId) => {
    navigate(
      `/movie/${movieId}?date=${moment().format("YYYY-MM-DD")}`
    );
  };

    return (
    <div>
      {/* Search Section */}
      <div
        style={{
          marginBottom: "var(--space-6)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Input
          size="large"
          placeholder="Search movies..."
          prefix={<SearchOutlined />}
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            maxWidth: 480,
          }}
        />
      </div>

      {/* Movie Grid */}
      {filteredMovies.length === 0 ? (
        <Empty description="No movies found" />
      ) : (
        <Row gutter={[24, 32]}>
          {filteredMovies.map((movie) => (
            <Col
              key={movie._id}
              xs={24}
              sm={12}
              md={8}
              lg={6}
            >
              <Card
                className="movie-surface-card"
                hoverable
                variant="borderless"
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                }}
                cover={
                  <img
                    alt={movie.movieName}
                    src={movie.poster}
                    style={{
                      height: 320,
                      objectFit: "cover",
                    }}
                    onClick={() => openMovie(movie._id)}
                  />
                }
                onClick={() => openMovie(movie._id)}
              >
                <Meta
                  title={
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 16,
                        marginBottom: 4,
                      }}
                    >
                      {movie.movieName}
                    </div>
                  }
                  description={
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                      }}
                    >
                      {movie.genre.join(", ")} {" • "} {movie.language.join(", ")}  
                      <br />
                      {movie.duration} mins
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Home;