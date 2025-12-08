// FILE: src/App.jsx (ОНОВЛЕНО)

import {useEffect, useState} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase/firebase';
import Register from "./login/Register.jsx";
import Login from "./login/Login.jsx";
import Contacts from "./Contacts.jsx";
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
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
        {/* Кореневий шлях репозиторію (використовує basename) */}
        <Route
            path="/"
            element={user ? <Navigate to="/contacts" replace/> : <Navigate to="/login" replace/>}
        />
        {/* /ContactBook-MaterialExpressive/login */}
        <Route
            path="/login"
            element={user ? <Navigate to="/contacts" replace/> : <Login/>}
        />
        {/* /ContactBook-MaterialExpressive/register */}
        <Route
            path="/register"
            element={user ? <Navigate to="/contacts" replace/> : <Register/>}
        />
        {/* /ContactBook-MaterialExpressive/contacts */}
        <Route
            path="/contacts"
            element={user ? <Contacts/> : <Navigate to="/login" replace/>}
        />

        {/* Видалено дублюючий шлях "/ContactBook-MaterialExpressive/" */}
      </Routes>
  );
}

export default App;