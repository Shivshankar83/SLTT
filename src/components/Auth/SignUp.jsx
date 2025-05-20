import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/logo.jpg";
import GoogleIcon from "../../assets/Google.png";
import { GoogleLogin } from "@react-oauth/google";
function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
  });

  // Rate limiting for form submission
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const SUBMIT_COOLDOWN = 3000; // 3 seconds

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{6,20}$/;
    return usernameRegex.test(username);
  };

  const validateEmail = (email) => {
    // More comprehensive email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
 const handleGoogleLogin = () => {
    const googleAuthUrl = `http://ec2-3-15-0-15.us-east-2.compute.amazonaws.com:8082/oauth2/authorization/google`;
    window.location.href = googleAuthUrl;
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = "";

    if (password.length >= 8) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    if (/(.)\1\1/.test(password)) {
      score -= 1;
      feedback = "Avoid repeated characters";
    }

    // Dictionary word check (simplified)
    const commonPasswords = ["password", "123456", "qwerty", "admin"];
    if (commonPasswords.some((pwd) => password.toLowerCase().includes(pwd))) {
      score -= 2;
      feedback = "Password contains common terms";
    }

    return { score: Math.max(0, Math.min(score, 5)), feedback };
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|:;'"<>,.?/])[A-Za-z\d!@#$%^&*()_\-+={}[\]|:;'"<>,.?/]{8,64}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time password strength checking
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const sanitizeInput = (input) => {
    // Basic input sanitization
    return input.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Implement rate limiting
    const now = Date.now();
    if (now - lastSubmitTime < SUBMIT_COOLDOWN) {
      toast.warning("Please wait before submitting again");
      return;
    }
    setLastSubmitTime(now);

    // Validate inputs
    let hasErrors = false;

    // Sanitize inputs
    const sanitizedUsername = sanitizeInput(formData.username);
    const sanitizedEmail = sanitizeInput(formData.email);
    const getUsernameValidationErrors = (username) => {
      const errors = [];

      if (username.length < 6) {
        errors.push("at least 6 characters");
      }

      if (username.length > 20) {
        errors.push("maximum 20 characters");
      }

      if (!/^[a-zA-Z0-9_-]*$/.test(username)) {
        errors.push("only letters, numbers, underscores and hyphens");
      }

      return errors;
    };

    const getPasswordValidationErrors = (password) => {
      const errors = [];

      // Check minimum length
      if (password.length < 8) {
        errors.push("at least 8 characters");
      }

      // Check for uppercase letter
      if (!/[A-Z]/.test(password)) {
        errors.push("1 uppercase letter");
      }

      // Check for lowercase letter
      if (!/[a-z]/.test(password)) {
        errors.push("1 lowercase letter");
      }

      // Check for number
      if (!/\d/.test(password)) {
        errors.push("1 number");
      }

      // Check for special character
      if (!/[!@#$%^&*()_\-+={}[\]|:;'"<>,.?/]/.test(password)) {
        errors.push("1 special character");
      }

      return errors;
    };

    // Validation with toast notifications
    if (!formData.username) {
      toast.error("Username is required");
      hasErrors = true;
    } else if (!validateUsername(formData.username)) {
      const usernameErrors = getUsernameValidationErrors(formData.username);
      const errorMessage =
        usernameErrors.length > 0
          ? `Username must have ${usernameErrors.join(", ")}`
          : "Username must be 6-20 characters and may include letters, numbers, underscores and hyphens";

      toast.error(errorMessage);
      hasErrors = true;
    }

    if (!formData.email || !validateEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      hasErrors = true;
    }

    if (!formData.password) {
      toast.error("Password is required");
      hasErrors = true;
    } else if (!validatePassword(formData.password)) {
      const passwordErrors = getPasswordValidationErrors(formData.password);
      const errorMessage =
        passwordErrors.length > 0
          ? `Password must include ${passwordErrors.join(", ")}`
          : "Password format is invalid";

      toast.error(errorMessage);
      hasErrors = true;
    } else if (passwordStrength.score < 3) {
      toast.warning("Please use a stronger password");
      hasErrors = true;
    }

    // Password match validation stays the same
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsSubmitting(true);
    try {
      const { password } = formData;
      setIsSubmitting(true);

      // Send data to the signup API endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_API_AUTH_URL}/api/auth/signup`,
        {
          username: sanitizedUsername,
          email: sanitizedEmail,
          password,
          roles: ["user"],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Signup response:", response.data);

      // Handle all possible success/error messages from the server
      if (response.data) {
        // Check the success flag from the server response
        if (response.data.success === true) {
          // Successful initial registration
          toast.success(
            response.data.message ||
              "Registration successful! Please check your email for activation."
          );
          setTimeout(() => {
            navigate("/login?status=check-email");
          }, 2000);
        } else if (response.data.success === false) {
          // Account exists but not activated
          if (response.data.message?.includes("not activated")) {
            toast.info(
              response.data.message ||
                "Account exists but not activated. Please check your email."
            );
            setTimeout(() => {
              navigate("/login?status=check-email");
            }, 2000);
          }
          // Account already exists and is activated
          else if (
            response.data.message?.includes("already taken and activated")
          ) {
            toast.error(
              response.data.message ||
                "This email is already registered. Please login."
            );
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          }
          // Other error messages from server
          else {
            toast.error(
              response.data.message || "Registration failed. Please try again."
            );
          }
        } else {
          // Fallback for unexpected response format
          toast.error("Unexpected response from server.");
          console.error("Unexpected response format:", response.data);
        }
      }
    } catch (error) {
      // Network or server error handling
      console.error("Signup error:", error);

      if (error.response) {
        // The server responded with an error status code
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message;

        switch (statusCode) {
          case 400:
            toast.error(
              errorMessage ||
                "Invalid registration data. Please check your inputs."
            );
            break;
          case 409:
            toast.error(
              errorMessage || "This username or email is already taken."
            );
            break;
          case 429:
            toast.error(
              errorMessage || "Too many requests. Please try again later."
            );
            break;
          case 500:
            toast.error(
              errorMessage || "Server error. Please try again later."
            );
            break;
          default:
            toast.error(
              errorMessage || "Registration failed. Please try again later."
            );
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        // Something happened in setting up the request
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password visibility toggle icons - cleaner SVG icons
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
    <div className="relative flex min-h-screen w-full items-center justify-center py-8 px-4 sm:px-6">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Unified Background */}
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
      <div className="relative z-10 flex w-full flex-col lg:flex-row max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden">
        {/* Left Side - Image (hidden on mobile) */}
        <div className="hidden lg:block lg:w-1/2 bg-white">
          <div className="h-full flex items-center justify-center p-6">
            <img
              src="https://img.freepik.com/free-vector/product-iteration-concept-illustration_114360-4725.jpg?t=st=1743068507~exp=1743072107~hmac=8e0807762af47584cd080e1242decc31a5572c09a6bc3a172bfe842c5bd5eafa&w=826"
              alt="Professional"
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Right Side - SignUP Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center bg-white p-4 sm:p-6 md:p-8">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md mx-auto"
            noValidate
          >
            <div className="flex flex-col items-center justify-center mb-6">
              <img
                src={logo}
                alt="Company Logo"
                className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full object-cover shadow-md"
              />
              <h1 className="mt-4 font-serif font-bold text-xl lg:text-2xl tracking-wide text-blue-900">
                Welcome To{" "}
                <span className="font-serif tracking-wide">
                  <span className="font-serif font-bold text-xl lg:text-2xl tracking-wide text-blue-900">
                    S
                  </span>
                  <span className="font-serif font-bold italic text-red-600 text-xl lg:text-2xl">
                    L
                  </span>
                  <span className="font-serif font-bold text-xl lg:text-2xl tracking-wide text-blue-900">
                    TT
                  </span>
                </span>
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Create your account to get started
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded-md w-full focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  aria-describedby="usernameHelp"
                  autoComplete="username"
                  maxLength={20}
                />
                <p id="usernameHelp" className="text-xs text-gray-500 mt-1">
                  Choose a username between 6-20 characters
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded-md w-full focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border border-gray-300 p-3 rounded-md w-full focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 pr-12 transition-colors"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1.5">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-colors ${
                            i < passwordStrength.score
                              ? i < 2
                                ? "bg-red-500"
                                : i < 4
                                ? "bg-yellow-500"
                                : "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs mt-1 text-gray-500">
                      {passwordStrength.score < 2
                        ? "Weak password"
                        : passwordStrength.score < 4
                        ? "Moderate password"
                        : "Strong password"}
                      {passwordStrength.feedback &&
                        ` - ${passwordStrength.feedback}`}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="border border-gray-300 p-3 rounded-md w-full focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 pr-12 transition-colors"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-tr from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all mt-6 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="mt-4">
                <p className="text-sm text-center">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
                  >
                    Log in
                  </Link>
                </p>
              </div>

              {/* Social Login Section */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 px-10">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full inline-flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                    aria-label="Sign up with Google"
                  >
                    <img
                      src={GoogleIcon}
                      alt="Google"
                      className="h-5 w-5 mr-2"
                    />
                    Sign up with Google
                  </button>
                </div>
              </div>

              <p className="text-xs text-center text-gray-500 mt-8">
                By creating an account, you agree to our{" "}
                <Link
                  to="/terms"
                  className="underline hover:text-gray-700 transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="underline hover:text-gray-700 transition-colors"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
