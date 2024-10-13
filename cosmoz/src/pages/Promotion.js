import React, { useState } from 'react';
import './Promotion.css';
import Sidebar from '../components/Sidebar'; // Sidebar component is used here

const Promotion = () => {
  const [promotions, setPromotions] = useState([
    { id: 1, name: 'John Doe', newRole: 'Manager' },
    { id: 2, name: 'Jane Smith', newRole: 'Team Lead' }
  ]);

  return (
    <div className="promotion">
        <Sidebar/>
      <h2>Promotions</h2>
      <table>
        <thead>
          <tr>
            <th>Staff Name</th>
            <th>New Role</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promotion) => (
            <tr key={promotion.id}>
              <td>{promotion.name}</td>
              <td>{promotion.newRole}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Promotion;
