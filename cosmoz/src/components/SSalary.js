import React, { useEffect, useState } from 'react';
import './SSalary.css';

const Salary = () => {
  const [salary, setSalary] = useState([]);

  useEffect(() => {
    // Fetch salary data from backend
    fetchSalary();
  }, []);

  const fetchSalary = async () => {
    const response = await fetch('/api/staff/salary');
    const data = await response.json();
    setSalary(data);
  };

  return (
    <div>
      <h2>Salary Details</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Salary</th>
            <th>Deductions</th>
            <th>Total Pay</th>
          </tr>
        </thead>
        <tbody>
          {salary.map((entry, index) => (
            <tr key={index}>
              <td>{entry.month}</td>
              <td>{entry.salary}</td>
              <td>{entry.deductions}</td>
              <td>{entry.totalPay}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Salary;
