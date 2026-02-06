import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from 'react-redux';

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

function App() {

  const { loading } = useSelector((state) => {
    return state.loader;
  });

  return (
    <>
      {
        loading && (
          <div className='loader-container'>
            <div className='loader'></div>
          </div>
        )
      }
      <BrowserRouter>
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
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

            <Route
            path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/partner" element={
              <ProtectedRoute>
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
        </Routes>
      </BrowserRouter>
    </>
  )

}

export default App;
