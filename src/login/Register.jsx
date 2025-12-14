import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/register";

export default function Register() {
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    // ДОДАНА ПЕРЕВІРКА: Переконайтеся, що всі поля заповнені
    if (!name.trim() || !login.trim() || !password.trim()) {
      alert("Please fill in all fields (Name, Login, and Password).");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // API expects { login, password }
      const response = await register(login, password);

      // Extract JWT token from response
      const token = response.data.token || response.data.access_token;
      const userData = response.data.user || { login, name };

      // Save JWT token to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({
        uid: userData.uid || userData.id,
        name,
        login
      }));

      alert("Registration successful!");
      navigate("/contacts");
    } catch (err) {
      console.error("Registration error:", err);

      let errorMessage = "Registration failed";

      if (err.response) {
        switch (err.response.status) {
          case 409:
            errorMessage = "Login already in use";
            break;
          case 400:
            errorMessage = err.response.data?.message || "Invalid login";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = err.response.data?.message || err.message;
        }
      } else if (err.request) {
        errorMessage = "Network error. Check your connection.";
      } else {
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
          <h2>Register</h2>

          <form onSubmit={handleRegister}>
            <input
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
            />

            <input
                type="text"
                placeholder="Login"
                value={login}
                onChange={e => setLogin(e.target.value)}
                required
            />

            <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>

          <p>
            Already have an account?{' '}
            <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
  );
}
