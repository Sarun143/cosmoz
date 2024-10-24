import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from './pages/Dashboard';
import AdminHome from './pages/AdminHome';
import StaffHome from "./pages/StaffHome";
import RouteManagement from "./pages/Routemanagement";
import StaffManagement from "./pages/StaffManagement";
import ViewFeedback from "./pages/ViewFeedback";
import Attendance from "./pages/Attendance";
import LeaveRequests from "./pages/LeaveRequests";
import Promotion from "./pages/Promotion";
import BusDetails from "./pages/BusDetails";
import Staffcreation from './pages/Staffcreation';
import Forgotpassword from "./pages/Forgotpassword";
import StaffDashboard from './components/StaffDashboard';

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
        <Route path='/admin/routemanagement' element = {<RouteManagement />} />
        <Route path='/admin/staffmanagemenet' element={<StaffManagement/>}/>
        <Route path='/admin/viewfeedback'element={<ViewFeedback/>}/>
        <Route path='/admin/attendance' element={<Attendance/>}/>
        <Route path='/admin/promotion' element={<Promotion/>}/>
        <Route path='/admin/leaverequests' element={<LeaveRequests/>}/>
        <Route path='/admin/busdetails' element={<BusDetails/>}/>
        <Route path='/Staffcreation' element={<Staffcreation/>}/>
        <Route path='/Forgotpassword' element={<Forgotpassword/>}/>
        <Route path='/StaffDashboard' element={<StaffDashboard/>}/>
        

      </Routes>
    </Router>
  );
}

export default App;


