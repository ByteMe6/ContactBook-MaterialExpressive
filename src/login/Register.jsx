import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // <--- Перевіряємо це
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    // ДОДАНА ПЕРЕВІРКА: Переконайтеся, що всі поля заповнені
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill in all fields (Name, Email, and Password).");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(db, `users/${user.uid}/profile`), {
        uid: user.uid,
        name,
        email,
        createdAt: Date.now(),
      });

      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        name,
        email
      }));

      alert("Registration successful!");
      navigate("/contacts");
    } catch (err) {
      console.error("Registration error:", err);

      let errorMessage = "Registration failed";
      switch (err.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email already in use";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Check your connection.";
          break;
        default:
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
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
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