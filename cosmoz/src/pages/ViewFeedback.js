import React, { useState } from 'react';
import './ViewFeedback.css';
import Sidebar from '../components/Sidebar'; // Sidebar component is used here
import Header from '../components/Header';

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, user: 'John', feedback: 'Great service!' },
    { id: 2, user: 'Janu', feedback: 'Could improve on timing.' }
  ]);

  return (
    <div className="view-feedback"> {/* Updated the class name here */}
      <Sidebar />
      <Header/>
      <h2>View Feedback</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback) => (
            <tr key={feedback.id}>
              <td>{feedback.user}</td>
              <td>{feedback.feedback}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewFeedback;
