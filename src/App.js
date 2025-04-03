import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BrickList from "./components/BricksList";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // ✅ Bootstrap JS for toggle
import Navbar from "./Navbar/Navbar";
import Login from "./Login/Login";

function App() {
  let userData = localStorage.getItem("role");

  return (
    <Router>
      {/* Login Route */}
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>

      <div>
        {/* ✅ Stylish Navbar */}
        {userData && <Navbar />}

        {/* 🔹 Content Section */}
        <div className="container mt-5 pt-4">
          {userData && (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/list" element={<BrickList />} />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
