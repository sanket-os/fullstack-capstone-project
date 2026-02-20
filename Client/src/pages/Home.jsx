import { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { message, Row, Col, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from '@ant-design/icons';
import moment from "moment";

import { getAllMovies } from "../api/movie";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { mapErrorToMessage } from "../utils/errorMapper";

const Home = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [searchText, setSearchText] = useState("");


  const getData = async () => {
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


  useEffect(() => {
    getData();
  }, []);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
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
      {/* Search Bar */}
      <Row
        className='justify-content-center w-100'
        style={{ padding: "20px 15px 20px 0px" }}
      >

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Input
            placeholder='Type here to search for movies'
            onChange={handleSearch}
            prefix={<SearchOutlined />}
            allowClear
          />
        </Col>
      </Row>


      <Row
        className='justify-content-center'
        gutter={{
          xs: 8,
          sm: 16,
          md: 24,
          lg: 32,
        }}
      >
        {filteredMovies.map((movie) => (
        <Col
          className='gutter-row mb-5'
          key={movie._id}
          span={{
            xs: 24,
            sm: 24,
            md: 12,
            lg: 10,
          }}
        >
          <div className='text-center'>
            <img
              className='cursor-pointer movie-poster'
              src={movie.poster}
              alt={movie.movieName}
              width={200}
              height={300}
              style={{
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                // transition: "transform 0.3s",
                objectFit: "cover",
              }}
              
              onClick={() => openMovie(movie._id)}
              // onMouseOver={(e) => {
              //   e.currentTarget.style.transform = "scale(1.05)";
              // }}
              // onMouseOut={(e) => {
              //   e.currentTarget.style.transform = "scale(1)";
              // }}
             
            />

            <h3
              className="cursor-pointer"
              onClick={() => openMovie(movie._id)}
            >
              {movie.movieName}
            </h3>
          </div>
        </Col>
            ))}
      </Row>
    </div>
  );
};

export default Home;
