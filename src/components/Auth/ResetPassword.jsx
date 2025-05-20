import React, { useState, useEffect, useCallback } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/Reset.jpg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getToken = useCallback(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('token');
  }, [location.search]);
  
  // Store token in state, initialized only once
  const [token] = useState(getToken);
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    match: false,
  });
  // Add state for password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid password reset token");
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [token, navigate]);
  
  // Password validation function
  const validatePassword = useCallback((password, confirmPassword) => {
    const errors = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === confirmPassword,
    };
    setPasswordErrors(errors);
    
    return Object.values(errors).every(Boolean);
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      
      // Only validate when needed
      if (name === "password") {
        validatePassword(value, newData.confirmPassword);
      } else if (name === "confirmPassword") {
        setPasswordErrors((prev) => ({
          ...prev,
          match: newData.password === value,
        }));
      }
      
      return newData;
    });
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { password, confirmPassword } = formData;
    
    // Validate password
    if (!validatePassword(password, confirmPassword)) {
      toast.error("Please fix the password validation errors");
      return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_AUTH_URL}/api/auth/reset-password?token=${token}&newPassword=${password}`
      );
      
      // Handle the JSON response structure
      if (response.data && typeof response.data === 'object') {
        if (response.data.success === true) {
          toast.success(response.data.message || "Password reset successfully");
          setIsSuccess(true);
          
          // Redirect to login after successful password reset
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          // Handle failure response even with 200 status
          toast.error(response.data.message || "Failed to reset password. Please try again.");
        }
      } else if (response.data === "Password reset successful") {
        // Handle legacy string response for backward compatibility
        toast.success("Password reset successfully");
        setIsSuccess(true);
        
        // Redirect to login after successful password reset
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        // If we got a 200 response but with unexpected content
        toast.warning("Unexpected response from server. Please try again or contact support.");
        console.log("Unexpected response:", response.data);
      }
      
    } catch (error) {
      console.error("Reset password error:", error);
      
      // Enhanced error handling
      if (error.response?.data) {
        const errorData = error.response.data;
        const errorMessage = errorData.message || 
                            (typeof errorData === 'string' ? errorData : 
                             "Failed to reset password. Please try again.");
        toast.error(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response from server. Please check your internet connection.");
      } else {
        // Something happened in setting up the request
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = () => {
    return (
      isLoading || 
      isSuccess || 
      !formData.password || 
      !formData.confirmPassword ||
      !passwordErrors.match
    );
  };

  const EyeIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="text-gray-500"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="text-gray-500"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );

  return (
    <div className="relative flex h-screen w-full items-center justify-center">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E50] to-[#4CA1AF]"></div>
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="white"
          fillOpacity="1"
          d="M0,288L48,266.7C96,245,192,203,288,165.3C384,128,480,96,576,122.7C672,149,768,235,864,272C960,309,1056,299,1152,293.3C1248,288,1344,288,1392,288L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>

      {/* Content Wrapper */}
      <div className="relative z-10 flex w-[90%] max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden">
        {/* Left Side - Image */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center overflow-hidden">
          <img
            src="https://img.freepik.com/free-vector/product-iteration-concept-illustration_114360-4725.jpg?t=st=1743068507~exp=1743072107~hmac=8e0807762af47584cd080e1242decc31a5572c09a6bc3a172bfe842c5bd5eafa&w=826"
            alt="Password Reset Illustration"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Right Side - Reset Password Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md flex flex-col rounded-lg bg-white text-gray-600 shadow-md">
            {/* Header */}
            <div className="flex flex-col mb-4 items-center justify-center p-4">
              <img
                src={logo}
                alt="Reset Password Logo"
                className="h-20 w-20 rounded-full mb-2"
              />
              <h1 className="text-xl font-semibold text-gray-800">Reset Your Password</h1>
              <p className="text-sm text-gray-500 text-center mt-1">
                Create a strong password to secure your account
              </p>
            </div>

            {/* Form */}
            <form className="p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* New Password Input */}
              <div className="space-y-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className={`border ${
                      formData.password && !passwordErrors.length
                        ? "border-red-500"
                        : "border-gray-300"
                    } outline-none text-gray-700 font-normal text-sm p-3 rounded-md w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 pr-12`}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isSuccess || isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={isSuccess || isLoading}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Password validation indicators */}
              {formData.password && (
                <div className="text-xs space-y-1 px-1">
                  <p className={passwordErrors.length ? "text-green-600" : "text-red-500"}>
                    ✓ At least 8 characters
                  </p>
                  <p className={passwordErrors.uppercase ? "text-green-600" : "text-red-500"}>
                    ✓ At least one uppercase letter
                  </p>
                  <p className={passwordErrors.lowercase ? "text-green-600" : "text-red-500"}>
                    ✓ At least one lowercase letter
                  </p>
                  <p className={passwordErrors.number ? "text-green-600" : "text-red-500"}>
                    ✓ At least one number
                  </p>
                  <p className={passwordErrors.special ? "text-green-600" : "text-red-500"}>
                    ✓ At least one special character
                  </p>
                </div>
              )}

              {/* Confirm Password Input */}
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className={`border ${
                      formData.confirmPassword && !passwordErrors.match
                        ? "border-red-500"
                        : "border-gray-300"
                    } outline-none text-gray-700 font-normal text-sm p-3 rounded-md w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 pr-12`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isSuccess || isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    disabled={isSuccess || isLoading}
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                
                {formData.confirmPassword && !passwordErrors.match && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`mt-2 font-semibold text-sm text-white py-3 rounded-md w-full bg-gradient-to-tr from-blue-600 to-blue-400 hover:opacity-90 active:scale-95 transition-all duration-200 
                  ${(isSubmitDisabled() || isLoading) ? "opacity-70 cursor-not-allowed" : ""}
                `}
                disabled={isSubmitDisabled()}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>

              {/* Back to Login Link */}
              <div className="text-center text-sm mt-2">
                <Link to="/login" className="text-blue-600 hover:text-blue-800 transition-colors">
                  ← Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;