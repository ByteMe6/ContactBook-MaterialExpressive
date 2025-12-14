import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginAPI } from "../api/login";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // API expects { login, password }
      const response = await loginAPI(login, password);

      // Extract JWT token from response
      const token = response.data.token || response.data.access_token;
      const user = response.data.user || { login };

      // Save JWT token to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful!");
      navigate("/contacts");
    } catch (err) {
      console.error("Login error:", err);

      let errorMessage = "Login failed";

      if (err.response) {
        // Server responded with error
        switch (err.response.status) {
          case 401:
            errorMessage = "Invalid login or password";
            break;
          case 429:
            errorMessage = "Too many failed attempts. Try again later.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = err.response.data?.message || "Login failed";
        }
      } else if (err.request) {
        // Request was made but no response
        errorMessage = "Network error. Check your connection.";
      } else {
        // Something else happened
        errorMessage = err.message;
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <div className="auth-container">
        <div className="auth-box">
          <h2>Login</h2>

          <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Login"
                value={login}
                onChange={e => setLogin(e.target.value)}
                required
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
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
