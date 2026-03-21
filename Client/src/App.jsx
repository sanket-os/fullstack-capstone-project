import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { Button, Tooltip } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Partner from './pages/Partner/Partner';
import Admin from './pages/Admin/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import SingleMovie from "./pages/SingleMovie";
import BookShow from "./pages/BookShow";
import MyBookings from "./pages/MyBookings";
import Forget from "./pages/Forget";
import Reset from "./pages/Reset";
import BookingSuccess from './pages/BookingSuccess';

import { useTheme } from './theme/themeContext';


function AppRoutes() {

  const { loading } = useSelector((state) => {
    return state.loader;
  });

  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const showPublicThemeToggle = ["/login", "/register", "/forget", "/reset"].includes(location.pathname);

  return (
    <>
      {
        loading && (
          <div className='loader-container'>
            <div className='loader'></div>
          </div>
        )
      }
   
      <Routes>
        {/* Protected */}
        <Route
          path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mybookings"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/partner" element={
            <ProtectedRoute allowedRoles={["partner"]}>
              <Partner />
            </ProtectedRoute>
          }
        />

        <Route
          path="/movie/:id"
          element={
            <ProtectedRoute>
              <SingleMovie />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book-show/:id"
          element={
            <ProtectedRoute>
              <BookShow />
            </ProtectedRoute>
          }
        />

        {/* Public */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/forget" element={<Forget />} />

        <Route path="/reset" element={<Reset />} />

        <Route path="/booking-success" element={<BookingSuccess />} />

      </Routes>

      {showPublicThemeToggle && (
        <div className='theme-toggle-container'>
          <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            <Button
              className='theme-toggle-btn'
              icon={isDark ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
            >
              {isDark ? 'Light' : 'Dark'}
            </Button>
          </Tooltip>
        </div>
      )}
    </>
  )
}


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}


export default App;
