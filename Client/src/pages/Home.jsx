import React from 'react'

function Home() {
  return (
    <div>Home</div>
  )
}

export default Home

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