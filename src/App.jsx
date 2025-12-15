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
    console.log('🚀 App mounted, checking auth...');
    checkAuth();
  }, []);

  useEffect(() => {
    console.log('👤 User state changed:', user);
  }, [user]);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    console.log('🔍 Checking auth:', { hasToken: !!token, hasUser: !!userData });

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('✅ User authenticated:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else {
      console.log('❌ No auth found');
    }

    setLoading(false);
  };

  if (loading) {
    console.log('⏳ Loading...');
    return (
        <div className="auth-container">
          <div className="auth-box">
            <h2>Loading...</h2>
          </div>
        </div>
    );
  }

  console.log('🎯 Rendering routes, user:', user ? 'logged in' : 'not logged in');

  return (
      <Routes>
        <Route
            path="/"
            element={user ? <Navigate to="/contacts" replace /> : <Navigate to="/login" replace />}
        />
        <Route
            path="/login"
            element={user ? <Navigate to="/contacts" replace /> : <Login setUser={setUser} />}
        />
        <Route
            path="/register"
            element={user ? <Navigate to="/contacts" replace /> : <Register setUser={setUser} />}
        />
        <Route
            path="/contacts"
            element={user ? <Contacts setUser={setUser} /> : <Navigate to="/login" replace />}
        />
      </Routes>
  );
}

export default App;