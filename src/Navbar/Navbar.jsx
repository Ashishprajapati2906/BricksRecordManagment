import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";


const Navbar = () => {
  return (
	<div>
	   <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top">
          <div className="container">
            <Link className="navbar-brand fw-bold" to="/">
              🚚 Bricks Management
            </Link>

            {/* 🔽 Mobile Menu Button */}
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

            {/* 🔹 Navbar Links */}
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
              </ul>
            </div>
          </div>
        </nav>
	</div>
  )
}

export default Navbar
