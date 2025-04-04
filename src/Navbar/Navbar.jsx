import React from 'react'
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm"
      style={{ position: 'sticky', top: 0, zIndex: 1000 }}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          🚚 Bricks Management
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-light fw-semibold px-3" to="/">
                ➕ Add Order
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light fw-semibold px-3" to="/list">
                📋 View Orders
              </Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-danger ms-3" onClick={handleLogout}>
                🔓 Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
