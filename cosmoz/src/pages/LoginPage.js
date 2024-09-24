import React, { useState } from "react";
import "./loginpage.css"; 
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Initialize useNavigate

  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.email) {
      newErrors.email = "Email or username is required";
    } else if (!emailPattern.test(formData.email) && !/^[a-zA-Z0-9]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email or username";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Login data submitted: ", formData);
      // Simulate successful login and redirect to dashboard
      navigate("/dashboard", { state: formData }); 
    }
  };

  const handleRegisterClick = () => {
    navigate("/signup"); // Navigate to the register page
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="logo">
          <img src="assests/images/cosmozlogo.png.png" alt="Cozmos" />
        </div>
        <h3>Begin your adventure with us and experience convenient, affordable, and comfortable bus travel.</h3>
      </div>
      <div className="login-right">
        <button className="google-btn">
          <img src="/assests/images/googlelogo.png" alt="Google" /> Sign in with Google
        </button>
        <h2>LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="username,email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <div className="forgot-password">
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="login-btn">Log in</button>
        </form>

        <div className="register-link">
          Not Registered Yet? 
          <span onClick={handleRegisterClick} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
            Create an account
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
