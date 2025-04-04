import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import BrickList from "./components/BricksList";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navbar from "./Navbar/Navbar";
import Login from "./Login/Login";

function App() {
  const userData = localStorage.getItem("role"); // Role ko check karna zaroori hai

  return (
    <Router>
      {userData && <Navbar />}
    
     
        <Routes>
          <Route path="/" element={userData ? <Home /> : <Navigate to="/login" />} />
          <Route path="/list" element={userData ? <BrickList /> : <Navigate to="/login" />} />
          <Route path="/login" element={!userData ? <Login /> : <Navigate to="/" />} />
        </Routes>
 
    </Router>
  );
}

export default App;
