import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginAPI } from "../api/login";

export default function Login({ onLoginSuccess }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    // Validation
    if (!login.trim()) {
      setError("Please enter your login");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 Attempting login for:', login);

      const response = await loginAPI(login, password);
      console.log('✅ Login response:', response.data);

      // Extract JWT token from response
      const token = response.data.token || response.data.access_token;
      const user = response.data.user || { login };

      if (!token) {
        throw new Error('No token received from server');
      }

      // Save JWT token and user data to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({
        ...user,
        login: user.login || login
      }));

      console.log('✅ Login successful, token saved');

      // Call the callback to update parent state
      if (onLoginSuccess) {
        onLoginSuccess();
      }

      // Navigate to contacts page
      navigate("/contacts");
    } catch (err) {
      console.error("❌ Login error:", err);

      let errorMessage = "Login failed";

      if (err.response) {
        // Server responded with error
        switch (err.response.status) {
          case 401:
            errorMessage = "Invalid login or password";
            break;
          case 429:
            errorMessage = "Too many failed attempts. Please try again later.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          case 400:
            errorMessage = err.response.data?.message || "Invalid credentials";
            break;
          default:
            errorMessage = err.response.data?.message || "Login failed";
        }
      } else if (err.request) {
        // Request was made but no response
        errorMessage = "Network error. Please check your connection.";
      } else {
        // Something else happened
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <div className="auth-container">
        <div className="auth-box">
          <h2>Login</h2>

          {error && (
              <div style={{
                background: 'rgba(242, 139, 130, 0.15)',
                color: 'var(--error)',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '16px',
                fontSize: '14px',
                borderLeft: '3px solid var(--error)',
                textAlign: 'left'
              }}>
                {error}
              </div>
          )}

          <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Login"
                value={login}
                onChange={e => {
                  setLogin(e.target.value);
                  setError("");
                }}
                disabled={isLoading}
                autoComplete="username"
                required
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError("");
                }}
                disabled={isLoading}
                autoComplete="current-password"
                required
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p>
            Don't have an account?{' '}
            <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
  );
}