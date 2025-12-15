import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/register";

export default function Register({ onRegisterSuccess }) {
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!login.trim()) {
      setError("Please enter a login");
      return;
    }

    if (login.length < 3) {
      setError("Login must be at least 3 characters");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      console.log('📝 Attempting registration for:', login);

      const response = await register(login, password);
      console.log('✅ Registration response:', response.data);


      const token = response.data.token || response.data.access_token;
      const userData = response.data.user || { login, name };

      if (!token) {
        throw new Error('No token received from server');
      }


      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({
        uid: userData.uid || userData.id,
        name: name.trim(),
        login: userData.login || login
      }));

      console.log('✅ Registration successful, token saved');

      // Call the callback to update parent state
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }

      // Navigate to contacts page
      navigate("/contacts");
    } catch (err) {
      console.error("❌ Registration error:", err);

      let errorMessage = "Registration failed";

      if (err.response) {
        switch (err.response.status) {
          case 409:
            errorMessage = "This login is already taken. Please choose another.";
            break;
          case 400:
            errorMessage = err.response.data?.message || "Invalid registration data";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = err.response.data?.message || err.message;
        }
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection.";
      } else {
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
          <h2>Register</h2>

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

          <form onSubmit={handleRegister}>
            {/*<input*/}
            {/*    type="text"*/}
            {/*    placeholder="Your Name"*/}
            {/*    value={name}*/}
            {/*    onChange={e => {*/}
            {/*      setName(e.target.value);*/}
            {/*      setError("");*/}
            {/*    }}*/}
            {/*    disabled={isLoading}*/}
            {/*    autoComplete="name"*/}
            {/*    required*/}
            {/*/>*/}

            <input
                type="text"
                placeholder="Login (min 3 characters)"
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
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError("");
                }}
                disabled={isLoading}
                autoComplete="new-password"
                required
            />

            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                disabled={isLoading}
                autoComplete="new-password"
                required
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
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