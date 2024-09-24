import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Move this here
import axios from 'axios';
import "./signuppage.css";

const SignupPage = () => {
  const navigate = useNavigate(); // Move inside the component

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({}); // To store validation errors

  // Validation function to check if all inputs are valid
  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^[0-9]{10}$/; // Adjust based on phone number format

    // Check if name is empty
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Check if email is valid
    if (!emailPattern.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    // Check if phone is valid
    if (!phonePattern.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    // Check if password is at least 6 characters long
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/register', formData);
        console.log("Registration successful:", response.data);
        navigate("/dashboard", { state: formData }); /////
        
        // Navigate to the login page after successful registration
        navigate("/login"); // Adjust the path as needed
      } catch (error) {
        // Improved error handling
        if (error.response) {
          console.error("Registration failed:", error.response.data);
          setErrors({ ...errors, api: error.response.data.message });
        } else if (error.request) {
          console.error("No response received:", error.request);
          setErrors({ ...errors, api: "No response from server" });
        } else {
          console.error("Error:", error.message);
          setErrors({ ...errors, api: error.message });
        }
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="logo">
          <img src="/assests/images/cosmozlogo.png.png" alt="Cozmos" />
        </div>
        <h3>
          Begin your adventure with us and experience convenient, affordable, and comfortable bus travel.
        </h3>
      </div>
      <div className="signup-right">
        <button className="google-btn">
          <img src="/assests/images/googlelogo.png" alt="Google" /> Sign in with Google
        </button>
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className="error">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {errors.phone && <p className="error">{errors.phone}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
          {errors.api && <p className="error">{errors.api}</p>} {/* Display API error */}
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
