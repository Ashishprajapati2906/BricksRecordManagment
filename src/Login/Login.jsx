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
    <div className="login-container">
      <div className="login-box">
        <h2 className="text-center mb-4">Welcome Back 👋</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <FaUser className="icon" />
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-box">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "🔒"}
            </span>
          </div>

          <button type="submit" className="btn btn-login">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
