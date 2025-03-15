import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NotificationsPage.css";
import Sidebar from "./Sidebar";
import Header from "./Header";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      console.log("Fetching notifications...");
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/notification/notifications");
      console.log("Notifications response:", response.data);
      setNotifications(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      const errorMessage = error.response 
        ? `Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}` 
        : `Network error: ${error.message}`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to determine notification severity
  const getNotificationSeverity = (daysRemaining, isExpired) => {
    if (isExpired || daysRemaining <= 0) return "expired";
    if (daysRemaining <= 5) return "high";
    if (daysRemaining <= 10) return "medium";
    return "low";
  };

  // Function to format the status message
  const getStatusMessage = (daysRemaining, isExpired) => {
    if (isExpired || daysRemaining <= 0) return "EXPIRED";
    return `${daysRemaining} days remaining`;
  };

  return (
    <div className="notifications-page">
      <Header />
      <Sidebar />
      <div className="notifications-container">
        <h2>DOCUMENT EXPIRY NOTIFICATIONS</h2>
        
        {loading ? (
          <div className="loading-spinner">Loading notifications...</div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <p>Check the browser console and server logs for details.</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="no-notifications">
            <p>No upcoming document expirations</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification, index) => {
              const severity = getNotificationSeverity(
                notification.daysRemaining,
                notification.isExpired
              );
              
              return (
                <div 
                  key={index} 
                  className={`notification-card ${severity}`}
                >
                  <div className="notification-header">
                    <h3>{notification.documentType} {notification.daysRemaining <= 0 ? "Expired" : "Expiration Alert"}</h3>
                    <span className={`days-remaining ${severity}`}>
                      {getStatusMessage(notification.daysRemaining, notification.isExpired)}
                    </span>
                  </div>
                  <div className="notification-details">
                    <p><strong>Bus:</strong> {notification.busRegistration} ({notification.busType})</p>
                    <p><strong>Expiry Date:</strong> {new Date(notification.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <button onClick={fetchNotifications} className="refresh-button">
          Refresh Notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationsPage;