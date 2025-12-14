import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Register from "./login/Register.jsx";
import Login from "./login/Login.jsx";
import Contacts from "./Contacts.jsx";
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check authentication on mount and route changes
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      console.log('🔍 Checking auth:', {
        hasToken: !!token,
        hasUser: !!userData
      });

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log('✅ User authenticated:', parsedUser.login);
        } catch (error) {
          console.error("Failed to parse user data:", error);
          // Clear invalid data
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Listen for storage changes (e.g., logout in another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Show loading screen while checking auth state
  if (loading) {
    return (
        <div className="auth-container">
          <div className="auth-box">
            <h2 style={{ textAlign: 'center', color: 'var(--primary)' }}>
              Loading...
            </h2>
            <p style={{
              textAlign: 'center',
              color: 'var(--on-surface-variant)',
              marginTop: '16px'
            }}>
              Please wait
            </p>
          </div>
        </div>
    );
  }

  return (
      <Routes>
        <Route
            path="/"
            element={
              user ? (
                  <Navigate to="/contacts" replace />
              ) : (
                  <Navigate to="/login" replace />
              )
            }
        />

        <Route
            path="/login"
            element={
              user ? (
                  <Navigate to="/contacts" replace />
              ) : (
                  <Login onLoginSuccess={checkAuth} />
              )
            }
        />

        <Route
            path="/register"
            element={
              user ? (
                  <Navigate to="/contacts" replace />
              ) : (
                  <Register onRegisterSuccess={checkAuth} />
              )
            }
        />

        <Route
            path="/contacts"
            element={
              user ? (
                  <Contacts user={user} onLogout={() => {
                    setUser(null);
                    navigate('/login');
                  }} />
              ) : (
                  <Navigate to="/login" replace />
              )
            }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

export default App;