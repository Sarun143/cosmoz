import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import UHeader from "../components/UHeader";
import "./Dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  const [userData, setUserData] = useState({
    Name: "sarun",
    email: "stilbeen143@gmail.com",
    mobile: "7559910825"
  });
  
  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    if (email) {
      const fetchUserData = async () => {
        try {
          const response = await axios.post("http://localhost:5000/api/user", { email });
          setUserData(response.data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };
      fetchUserData();
    }
  }, [email]);

  const handleUpdate = (e) => {
    e.preventDefault();
    // Handle update logic here
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/feedback/submit", feedbackData);
      alert(response.data.message);
      // Show sentiment analysis result to user
      if (response.data.analysis) {
        const { sentiment, topics } = response.data.analysis;
        let message = `Thank you for your ${sentiment} feedback`;
        if (topics.length > 0 && topics[0] !== 'general') {
          message += ` about ${topics.join(', ')}`;
        }
        message += "! We appreciate your input.";
        alert(message);
      }
      setFeedbackData({ name: userData.Name, mobile: userData.mobile, email: userData.email, feedback: "" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback");
    }
  };

  const [feedbackData, setFeedbackData] = useState({
    name: userData.Name,
    mobile: userData.mobile,
    email: userData.email,
    feedback: ""
  });

  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Welcome, {userData.Name}</h2>
          <p>Manage your Bookings</p>
        </div>
        <UHeader/>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === "profile" ? "active" : ""}`}
            onClick={() => setActiveSection("profile")}
          >
            <span className="nav-icon">👤</span>
            My Profile
          </button>
          <button 
            className={`nav-item ${activeSection === "bookings" ? "active" : ""}`}
            onClick={() => setActiveSection("bookings")}
          >
            <span className="nav-icon">📋</span>
            My Bookings
          </button>
          <button 
            className={`nav-item ${activeSection === "track" ? "active" : ""}`}
            onClick={() => navigate("/LiveTracking")} 
          >
            <span className="nav-icon">🚌</span>
            Track My Bus
          </button>
          <button 
            className={`nav-item ${activeSection === "feedback" ? "active" : ""}`}
            onClick={() => setActiveSection("feedback")} id="feedback"
          >
            <span className="nav-icon">💬</span>
            Feedback
          </button>
        </nav>
      </div>

      <main className="main-content">
        {activeSection === "profile" && (
          <div className="profile-form">
            <form onSubmit={handleUpdate}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <div className="input-with-icon">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      value={userData.Name}
                      onChange={(e) => setUserData({...userData, Name: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email address</label>
                  <div className="input-with-icon">
                    <span className="input-icon">✉️</span>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Mobile</label>
                  <div className="input-with-icon">
                    <span className="input-icon">📱</span>
                    <input
                      type="tel"
                      value={userData.mobile}
                      onChange={(e) => setUserData({...userData, mobile: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="update-button">
                Update
              </button>
            </form>
          </div>
        )}

        {activeSection === "feedback" && (
          <div className="feedback-container">
            <h2>Feedback</h2>
            <p>Leave your feedback and queries to help us to continue our high quality of service.</p>
            
            <form onSubmit={handleFeedbackSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={feedbackData.name}
                  onChange={(e) => setFeedbackData({...feedbackData, name: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  value={feedbackData.mobile}
                  onChange={(e) => setFeedbackData({...feedbackData, mobile: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Email address</label>
                <input
                  type="email"
                  value={feedbackData.email}
                  onChange={(e) => setFeedbackData({...feedbackData, email: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Feedback</label>
                <textarea
                  placeholder="Your Feedback"
                  id="fillfeedback"
                  value={feedbackData.feedback}
                  onChange={(e) => setFeedbackData({...feedbackData, feedback: e.target.value})}
                ></textarea>
              </div>
              
              <button type="submit" className="feedback-button" id="submitfeedback">
                Feedback
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;