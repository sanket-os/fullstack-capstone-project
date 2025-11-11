import React, { useEffect, useState } from 'react';
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { useDispatch } from 'react-redux';
import { getAllMovies } from "../api/movie";
import { message, Row, Col, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from '@ant-design/icons';
import moment from "moment";

const Home = () => {

  const dispatch = useDispatch();
  const [movies, setMovies] = useState(null);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  
  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllMovies();
      if (response.success) {
        setMovies(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    getData();
  }, []);

  return (

    <div>
      <Row
        className='justify-content-center w-100'
        style={{ padding: "20px 15px 20px 0px" }}
      >

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Input
            placeholder='Type here to search for movies'
            onChange={handleSearch}
            prefix={<SearchOutlined />}
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
        {movies &&
          movies
            .filter((movie) => 
              movie.movieName.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((movie) => (
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
                    onClick={() => {
                      navigate(
                        `/movie/${movie._id}?date=${moment().format(
                          "YYYY-MM-DD"
                        )}`
                      );
                    }}
                    className='cursor-pointer'
                    src={movie.poster}
                    alt="Movie Poster"
                    width={200}
                    height={300}
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.3s",
                      objectFit: "cover",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  />
                  <h3
                    onClick={() => {
                      navigate(
                        `/movie/${movie._id}?date=${moment().format(
                          "YYYY-MM-DD"
                        )}`
                      );
                    }}
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

// import React, { useEffect, useState } from 'react'
// import { message } from 'antd';
// import { Link, useNavigate } from "react-router-dom";
// import { GetCurrentUser } from '../api/user';

// const Home = () => {
//   const [userInfo, setUserInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const getValidUser = async () => {
//     try {
//       setLoading(true);
//       const response = await GetCurrentUser();
//       console.log('API Response:', response); // Debug log
      
//       if (response.success) {
//         setUserInfo(response?.data);
//       } else {
//         message.error(response.message || 'Failed to fetch user data');
//       }
//     } catch (error) {
//       console.error('Error fetching user:', error); // Debug log
//       message.error(error.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("tokenForBMS");
//     if (token) {
//       getValidUser();
//     } else {
//       navigate("/login");
//     }
//   }, [navigate]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <div>Home</div>
//       {userInfo ? (
//         <>
//           <div>Hello : {userInfo.name}</div>
//           <div>Email : {userInfo.email}</div>
//         </>
//       ) : (
//         <div>No user data available</div>
//       )}
//       <Link 
//         to="/login"
//         onClick={() => {
//           localStorage.removeItem("tokenForBMS");
//         }}
//       >
//         Logout
//       </Link>
//     </>
//   );
// };

// export default Home;