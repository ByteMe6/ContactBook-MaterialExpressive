import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from "./login/Register.jsx";
import Login from "./login/Login.jsx";
import Contacts from "./Contacts.jsx";
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  // Show loading screen while checking auth state
  if (loading) {
    return (
        <div className="auth-container">
          <div className="auth-box">
            <h2>Loading...</h2>
          </div>
        </div>
    );
  }

  return (
      <Routes>
        <Route
            path="/"
            element={user ? <Navigate to="/contacts" replace /> : <Navigate to="/login" replace />}
        />
        <Route
            path="/login"
            element={user ? <Navigate to="/contacts" replace /> : <Login />}
        />
        <Route
            path="/register"
            element={user ? <Navigate to="/contacts" replace /> : <Register />}
        />
        <Route
            path="/contacts"
            element={user ? <Contacts /> : <Navigate to="/login" replace />}
        />
      </Routes>
  );
}

export default App;
