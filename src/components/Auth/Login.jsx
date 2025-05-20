import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logo.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DOMPurify from "dompurify";
import Cookies from "js-cookie";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../redux/features/userSlice";
import { decodeJWT } from "../../utils/jwtUtils";
import GoogleIcon from "../../assets/Google.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginLocked, setLoginLocked] = useState(false);

  useEffect(() => {
    const savedEmail = Cookies.get("userEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);
  const handleGoogleLogin = () => {
    const googleAuthUrl = `http://ec2-3-15-0-15.us-east-2.compute.amazonaws.com:8082/oauth2/authorization/google`;
    window.location.href = googleAuthUrl;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const sanitizeInput = (input) => {
    // Basic input sanitization
    return typeof input === "string" ? DOMPurify.sanitize(input.trim()) : input;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    if (!/[@$!%*?&]/.test(password)) {
      errors.push("1 special character");
    }

    return errors;
  };

  const location = useLocation();
  const from = location.state?.from?.pathname || "/user";

  // Handle successful login and JWT processing

  // const processSuccessfulLogin = (token) => {
  //   const decodedToken = decodeJWT(token);
  //   console.log(decodedToken);
  //   if (!decodedToken) {
  //     toast.error("Invalid authentication token");
  //     return false;
  //   }

  //   const { userId = "", sub = "", email = "", role = [] } = decodedToken;

  //   const userRole = role.length > 0 ? role[0] : "user"; // get first role or default
  //   console.log(userRole, userId, email);
  //   dispatch(
  //     setUser({
  //       username: sub,
  //       userId: userId,
  //       email: email || formData.email,
  //       role: userRole,
  //     })
  //   );
  //   return userRole;
  // };
  const processSuccessfulLogin = (token) => {
    const decodedToken = decodeJWT(token);
    if (!decodedToken) {
      toast.error("Invalid authentication token");
      return false;
    }

    const { userId = "", sub = "", email = "", role = [] } = decodedToken;

    const userRole = role.length > 0 ? role[0] : "user";

    const userData = {
      username: sub,
      userId: userId,
      email: email,
      role: userRole,
    };

    // Save user in Redux
    dispatch(setUser(userData));

    // ✅ Save user in localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    return userRole;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const sanitizedEmail = sanitizeInput(formData.email);

    let hasValidationErrors = false;

    if (!validateEmail(sanitizedEmail)) {
      toast.error("Invalid email format");
      hasValidationErrors = true;
    }

    if (!validatePassword(formData.password)) {
      const passwordErrors = getPasswordValidationErrors(formData.password);
      const errorMessage =
        passwordErrors.length > 0
          ? `Password must include ${passwordErrors.join(", ")}`
          : "Invalid password format";

      toast.error(errorMessage);
      hasValidationErrors = true;
    }

    if (hasValidationErrors) {
      setIsSubmitting(false);
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("email", sanitizedEmail);
      params.append("password", formData.password);

      const response = await axios.post(
        `${import.meta.env.VITE_API_AUTH_URL}/api/auth/login/v1`,
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
        }
      );

      if (typeof response.data === "string") {
        if (response.data.includes("Too many login attempts")) {
          toast.error("🔒 Too many login attempts. Please try again later.");
        } else {
          toast.error(DOMPurify.sanitize(response.data));
        }
        setIsSubmitting(false);
        return;
      }

      const resData = response.data;
      const token = resData?.data?.token;

      const isValidJWT =
        token &&
        typeof token === "string" &&
        token.split(".").length === 3 &&
        token.length > 30;

      if (isValidJWT) {
        toast.success("Login successful!");

        // Store token securely in cookie
        const expiryDays = rememberMe ? 30 : 1;
        Cookies.set("authToken", token, {
          expires: expiryDays,
          secure: window.location.protocol === "https:",
          sameSite: "strict",
          path: "/",
        });

        if (rememberMe) {
          // Only store email, never passwords
          Cookies.set("userEmail", sanitizedEmail, {
            expires: 30,
            secure: window.location.protocol === "https:",
            sameSite: "strict",
            path: "/",
          });
        } else {
          Cookies.remove("userEmail");
        }

        // Process token and store user details in Redux
        const role = processSuccessfulLogin(token);
        if (role) {
          console.log(role);
          setTimeout(() => {
            if (role === "USER") {
              navigate("/user");
            } else if (role === "DRIVER") {
              navigate("/driver");
            } else {
              navigate("/home");
            }
          }, 1000);
        } else {
          setIsSubmitting(false);
        }
      } else {
        // Handle error messages in token field
        handleErrorMessage(token);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        // Server responded with an error
        if (typeof error.response.data === "string") {
          toast.error(DOMPurify.sanitize(error.response.data));
          setIsSubmitting(false);
          return;
        }

        const status = error.response.status;
        const errorToken = error.response.data?.data?.token;

        if (errorToken && typeof errorToken === "string") {
          handleErrorMessage(errorToken);
        } else {
          // Handle based on status code
          switch (status) {
            case 400:
              toast.error("❌ Invalid request. Please check your information.");
              break;
            case 401:
              toast.error("🔑 Invalid email or password.");
              break;
            case 403:
              toast.error(
                "📧 Your account is not activated. Please check your email."
              );
              break;
            case 429:
              toast.error(
                "🔒 Too many login attempts. Please try again later."
              );
              break;
            default:
              toast.error(
                DOMPurify.sanitize(
                  error.response.data?.message || "Login failed."
                )
              );
          }
        }
      } else if (error.request) {
        // Network error
        toast.error(
          "Cannot connect to the server. Please check your internet connection."
        );
      } else if (error.message && error.message.includes("token")) {
        // Client-side error with token
        toast.error("An unexpected error occurred. Please try again.");
      } else {
        toast.error("Login failed. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  // Helper function to handle error messages from token field
  const handleErrorMessage = (message) => {
    if (!message) {
      toast.error("Login failed. Please try again.");
      return;
    }

    // Pattern matching for common error messages
    if (message.includes("Incorrect email or password")) {
      toast.error(
        "🔑 Invalid credentials. Please check your email and password."
      );
    } else if (message.includes("No user registered")) {
      toast.error("📭 No account found with this email address.");
    } else if (message.includes("check your email to activate")) {
      toast.error("📧 Your account is not activated. Please check your email.");
    } else if (message.includes("Too many login attempts")) {
      toast.error("🔒 Too many login attempts. Please try again later.");
      // Optional: Set a flag to show a countdown timer
      setLoginLocked(true);
    } else {
      // For any other message, display it directly
      toast.error(DOMPurify.sanitize(message));
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

        {/* Right Side - Login Form */}
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
                Login to your account
              </p>
            </div>

            <div className="space-y-4">
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border border-gray-300 p-3 rounded-md w-full focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 pr-12 transition-colors"
                    autoComplete="current-password"
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
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 cursor-pointer accent-blue-500"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Remember me
                </label>
                <div className="flex-grow"></div>
                <Link
                  to="/forget"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
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
                  "Log in"
                )}
              </button>

              <div className="mt-4">
                <p className="text-sm text-center">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
                  >
                    Sign up
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
                    aria-label="Login with Google"
                  >
                    <img
                      src={GoogleIcon}
                      alt="Google"
                      className="h-5 w-5 mr-2"
                    />
                    Login with Google
                  </button>
                </div>
              </div>

              <p className="text-xs text-center text-gray-500 mt-8">
                By logging in, you agree to our{" "}
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
