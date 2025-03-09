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
// import LeaveRequests from "./pages/LeaveRequests";
import Promotion from "./pages/Promotion";
import BusDetails from "./pages/BusDetails";
import Staffcreation from './pages/Staffcreation';
import Forgotpassword from "./pages/Forgotpassword";
import StaffDashboard from './components/StaffDashboard';
import StaffProfile from "./components/SProfile";
import StaffAttendance from "./components/SAttendance";
import StaffSalary from "./components/SSalary";
import StaffLeaveManagement from "./components/SLeaveManagement";
import StaffScheduledTrips from "./components/SScheduledTrips";
import SearchResults from "./pages/SearchResults";
import BookingPage from './pages/BookingPage';
import Promotioncomponet from "./components/Promotioncomponent";
import ViewLeaveRequests from "./components/LeaveRequest";
import PDFProcessor from "./pages/PDFProcessor";
import SalaryManagement from "./components/SalaryManagement";
import BusBooking from "./components/Booking";
import AddBusPage from "./pages/AddBusPage";
import UHeader from "./components/UHeader";
import FeedbackAnalytics from "./components/FeedbackAnalytics";
//import Slocation from "./components/Slocation";
import LiveTracking from "./components/LiveTracking";
//import BusLocation from "./components/BusLocation";
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
        <Route path='/admin/leaverequests' element={<ViewLeaveRequests/>}/>
        <Route path='/admin/busdetails' element={<BusDetails/>}/>
        <Route path='/Staffcreation' element={<Staffcreation/>}/>
        <Route path='/Forgotpassword' element={<Forgotpassword/>}/>
        <Route path='/StaffDashboard/*' element={<StaffDashboard/>}/>
        <Route path='/staff/profile' element={<StaffProfile />} />
        <Route path='/staff/attendance' element={<StaffAttendance />} />
        <Route path='/staff/salary' element={<StaffSalary />} />
        <Route path='/staff/scheduledtrips' element={<StaffScheduledTrips />} />
        <Route path='/staff/leave-management' element={<StaffLeaveManagement />} />
        <Route path='/searchresults' element={<SearchResults />} />
        <Route path='BookingPage' element={<BookingPage />} />
        <Route path='/Promotioncomponet' element={<Promotioncomponet />} />
        <Route path='/PDFProcessor' element={<PDFProcessor />} />
        <Route path='/admin/salaryManagement' element={<SalaryManagement />} />
        <Route path='/admin/busbooking' element={<BusBooking />} />
        <Route path='/add-bus' element={<AddBusPage />} />
        <Route path='/LiveTracking' element={<LiveTracking />} />
        <Route path='/UHeader' element={<UHeader />} />
        <Route path='/FeedbackAnalytics' element={<FeedbackAnalytics />} />
        {/* //<Route path='Slocation' element={<Slocation />} />
        //<Route path='LiveTracking' element={<LiveTracking />} />
        <Route path='BusLocation' element={<BusLocation />} /> */}


      </Routes>
    </Router>
  );
}

export default App;


