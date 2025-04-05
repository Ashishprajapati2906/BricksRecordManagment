import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa"; // Icons for better UI
import "./Login.css"; // Custom CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("⚠️ Please fill in all fields");
      return;
    }

    const credentials = [
      { email: "user1@gmail.com", password: "123456" },
      { email: "user2@gmail.com", password: "123456" },
    ];

    const matchedUser = credentials.some(
      (user) => user.email === email && user.password === password
    );

    if (matchedUser) {
      localStorage.setItem("role", "user");
      window.location.href = "/";
    } else {
      setError("❌ Invalid Email or Password");
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center vh-100">
      <div className="login-box shadow p-4 rounded">
        <h2 className="text-center mb-4">👋 Welcome Sandeep</h2>
  
        {error && <div className="alert alert-danger">{error}</div>}
  
        <form onSubmit={handleSubmit}>
          <div className="input-box mb-3 position-relative">
            <FaUser className="icon position-absolute top-50 translate-middle-y ms-2 text-secondary" />
            <input
              type="email"
              className="form-control ps-5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
  
          <div className="input-box mb-3 position-relative">
            <FaLock className="icon position-absolute top-50 translate-middle-y ms-2 text-secondary" />
            <input
              type={showPassword ? "text" : "password"}
              className="form-control ps-5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <span
              className="toggle-password position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? "👁️" : "🔒"}
            </span>
          </div>
  
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default Login;
