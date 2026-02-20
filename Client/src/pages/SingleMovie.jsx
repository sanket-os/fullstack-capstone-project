import { useEffect, useState } from "react";
import { message, Input, Divider, Row, Col } from "antd";
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
    navigate(`/movie/${id}?date=${selectedDate}`);
  };


  useEffect(() => {
    fetchMovie();
  }, [id]);


  useEffect(() => {
    fetchTheatres();
  }, [date, id]);


  return (
    <div className="inner-container" style={{ paddingTop: "20px" }}>
      {movie && (
        <div className="d-flex single-movie-div">
          <div className="flex-shrink-0 me-3 single-movie-img">
            <img src={movie.poster} width={150} alt="Movie Poster" />
          </div>


          <div className="w-100">
            <h1 className="mt-0">{movie.movieName}</h1>

            <p className="movie-data">
              Language: <span>{movie.language}</span>
            </p>

            <p className="movie-data">
              Genre: <span>{movie.genre}</span>
            </p>

            <p className="movie-data">
              Release Date:{" "}
              <span>
                {moment(movie.releaseDate).format("MMM Do YYYY")}
              </span>
            </p>

            <p className="movie-data">
              Duration: <span>{movie.duration} Minutes</span>
            </p>

            <hr />

            <div className="d-flex flex-column-mob align-items-center mt-3">
              <label className="me-3 flex-shrink-0">Choose the date:</label>
              <Input
                type="date"
                min={moment().format("YYYY-MM-DD")}
                value={date}
                onChange={handleDateChange}
                className="max-width-300 mt-8px-mob"
                prefix={<CalendarOutlined />}
              />
            </div>
          </div>
        </div>
      )}


      {theatres.length === 0 && (
        <div className="pt-3">
          <h2 className="blue-clr">
            Currently, no theatres available for this movie!
          </h2>
        </div>
      )}


      {theatres.length > 0 && (
        <div className="theatre-wrapper mt-3 pt-3">
          <h2>Theatres</h2>


          {theatres.map((theatre) => (
            <div key={theatre._id}>
              <Row gutter={24}>
                <Col xs={24} lg={8}>
                  <h3>{theatre.name}</h3>
                  <p>{theatre.address}</p>
                </Col>


                <Col xs={24} lg={16}>
                  <ul className="show-ul">
                    {[...theatre.shows]
                      .sort(
                        (a, b) =>
                          moment(a.time, "HH:mm") -
                          moment(b.time, "HH:mm")
                      )
                      .map((show) => (
                        <li
                          key={show._id}
                          onClick={() =>
                            navigate(`/book-show/${show._id}`)
                          }
                        >
                          {moment(show.time, "HH:mm").format("hh:mm A")}
                        </li>
                      ))}
                  </ul>
                </Col>
              </Row>


              <Divider />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleMovie;
