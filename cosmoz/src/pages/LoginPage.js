  import React, { useState } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import "./loginpage.css";

  const LoginPage = () => {
    const [formData, setFormData] = useState({
      email: "",
      password: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false); // For showing a loading state
    const navigate = useNavigate();

    // Inline validation function for individual fields
    const validateField = (name, value) => {
      let error = "";
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (name === "email") {
        if (!value.trim()) {
          error = "Email or username is required";
        } else if (!emailPattern.test(value)) {
          error = "Enter a valid email";
        }
      }

      if (name === "password") {
        if (!value.trim()) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        }
      }

      return error;
    };

    // Handle field changes and validate each field as it's being updated
    const handleChange = (e) => {
      const { name, value } = e.target;

      setFormData({ ...formData, [name]: value });

      // Validate the field as the user types and show errors
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    };

    // Overall form validation before submission
    const validate = () => {
      const newErrors = {};
      let isValid = true;

      Object.keys(formData).forEach((key) => {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return isValid;
    };

  // Handle form submission with token storage
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);
      try {
        const response = await axios.post("http://localhost:5000/api/auth/login", formData);
        const { token, role, redirectUrl } = response.data;
        console.log("Login successful:", response.data);

        // Save the token to localStorage or sessionStorage
        localStorage.setItem("authToken", token);

        // Navigate to the correct page based on the role
        navigate(redirectUrl, {
          state: {
            email: formData.email,
          },
        });
      } catch (error) {
        if (error.response && error.response.data.message) {
          setErrors({ api: error.response.data.message });
        } else {
          setErrors({ api: "Server error" });
        }
      } finally {
        setIsSubmitting(false);
      }
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
              placeholder="Email"
              id="emailid"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>} {/* Inline email error */}

            <input
              type="password"
              name="password"
              placeholder="Password"
              id="passwords"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>} {/* Inline password error */}

            <div className="forgot-password">
              <a href="/Forgotpassword">Forgot Password?</a>
            </div>

            <button id = "login" type="submit" className="login-btn" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
            {errors.api && <p className="error">{errors.api}</p>} {/* API error */}
          </form>

          <div className="register-link">
            Not Registered Yet?{" "}
            <span
              onClick={handleRegisterClick}
              style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
            >
              Create an account
            </span>
          </div>
        </div>
      </div>
    );
  };

  export default LoginPage;
