import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from './pages/Dashboard';
import AdminHome from './pages/AdminHome';
import StaffHome from "./pages/StaffHome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/AdminHome' element={<AdminHome />} />
        <Route path="/StaffHome" element={<StaffHome/>}/>
      </Routes>
    </Router>
  );
}

export default App;


