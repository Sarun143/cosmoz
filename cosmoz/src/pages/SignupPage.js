import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./signuppage.css"; // your CSS file

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for button

  // Validate form fields and OTP
  const validateField = (name, value) => {
    let error = "";
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^[0-9]{10}$/;
    const namePattern = /^[A-Z][a-zA-Z\s]+$/; // Ensures first letter is capital and only letters/spaces follow

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (!namePattern.test(value)) {
          error = "Name must start with a capital letter and contain only letters and spaces";
        }
        break;
      case "email":
        if (!emailPattern.test(value)) error = "Enter a valid email";
        break;
      case "phone":
        if (!phonePattern.test(value)) error = "Enter a valid 10-digit phone number";
        break;
      case "password":
        if (value.length < 6) error = "Password must be at least 6 characters";
        break;
      case "confirmPassword":
        if (value !== formData.password) error = "Passwords do not match";
        break;
      case "otp":
        if (!value || value.length !== 6) error = "Enter a valid 6-digit OTP";
        break;
      default:
        break;
    }
    return error;
  };

  // Handle form data change with inline validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate each field as it's changed
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  // Submit OTP for verification
  const handleOtpSubmit = async () => {
    const otpError = validateField("otp", otp);
    if (otpError) {
      setErrors({ ...errors, otp: otpError });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", { email: formData.email, otp });
      console.log("OTP verification successful:", response.data);
      await axios.post("http://localhost:5000/api/auth/register", { ...formData });
      navigate("/login"); // Navigate to login page after successful registration
    } catch (error) {
      if (error.response) {
        setErrors({ api: error.response.data.message });
      } else {
        setErrors({ api: "Server error" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submit to send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = {};
    let isValid = true;
    
    // Validate all fields before submission
    for (let key in formData) {
      const error = validateField(key, formData[key]);
      if (error) {
        formErrors[key] = error;
        isValid = false;
      }
    }

    setErrors(formErrors);

    if (isValid) {
      setIsSubmitting(true);
      try {
        await axios.post("http://localhost:5000/api/auth/send-otp", { email: formData.email });
        setIsOtpSent(true); // OTP sent successfully, show OTP input box
      } catch (error) {
        setErrors({ api: "Error sending OTP" });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="logo">
          <img src="/assests/images/cosmozlogo.png.png" alt="Cosmos" />
        </div>
        <h3>Begin your adventure with us and experience convenient, affordable, and comfortable bus travel.</h3>
      </div>

      <div className="signup-right">
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

          <button type="submit" className="signup-btn" disabled={isSubmitting}>
            {isSubmitting ? "Sending OTP..." : "Send OTP"}
          </button>
          {errors.api && <p className="error">{errors.api}</p>}
        </form>

        {isOtpSent && (
          <div className="otp-popup">
            <h2>Enter OTP</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setErrors({ ...errors, otp: validateField("otp", e.target.value) });
              }}
              required
            />
            {errors.otp && <p className="error">{errors.otp}</p>}

            <button onClick={handleOtpSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting OTP..." : "Submit OTP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
