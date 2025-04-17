import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');

  // Check for saved theme on page load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Update theme on state change and save to localStorage
  useEffect(() => {
    document.body.className = theme; // Add the theme class to body

    // Add theme-specific CSS dynamically
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = theme === 'light' ? '/path-to-light-theme.css' : '/path-to-dark-theme.css';
    link.id = 'theme-stylesheet'; // So we can remove the old one when toggling

    // Remove old stylesheet if exists
    const oldLink = document.getElementById('theme-stylesheet');
    if (oldLink) {
      oldLink.remove();
    }

    // Append new stylesheet to head
    document.head.appendChild(link);

    // Save theme to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <nav
      className={`navbar navbar-expand-lg shadow-sm ${theme === 'light' ? 'navbar-light bg-light' : 'navbar-dark bg-dark'}`}
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
              <button className="btn btn-danger ms-3" onClick={toggleTheme}>
                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
              </button>
            </li>
            <li className="nav-item mt-1">
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
