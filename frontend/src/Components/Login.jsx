

import { useState } from "react";
import { login, getCurrentUser } from "../services/api.js";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 🔹 Step 1: Login — server sets secure HTTP-only cookie
      await login(email, password);

      // 🔹 Step 2: Fetch user info using cookie session (no token stored locally)
      const user = await getCurrentUser();

      // 🔹 Step 3: Send user info to parent component
      onLogin(user);
    } catch (err) {
      // Use generic error message to prevent information leakage
      const message = "Invalid email or password. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="login-container"
      style={{
        maxWidth: "400px",
        margin: "60px auto",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        background: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Admin Login</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setValidationErrors({ ...validationErrors, email: "" });
            }}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: validationErrors.email ? "1px solid #dc3545" : "1px solid #ccc",
            }}
          />
          {validationErrors.email && (
            <p style={{ color: "#dc3545", fontSize: "12px", marginTop: "5px", marginBottom: 0 }}>
              {validationErrors.email}
            </p>
          )}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setValidationErrors({ ...validationErrors, password: "" });
            }}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: validationErrors.password ? "1px solid #dc3545" : "1px solid #ccc",
            }}
          />
          {validationErrors.password && (
            <p style={{ color: "#dc3545", fontSize: "12px", marginTop: "5px", marginBottom: 0 }}>
              {validationErrors.password}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "10px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
          {error}
        </p>
      )}
    </div>
  );
}
