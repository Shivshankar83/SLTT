import React, { useState } from "react";
import axios from "axios";
import logo from "../../assets/logo.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DOMPurify from "dompurify";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const sanitizeInput = (input) => {
    return typeof input === "string" ? DOMPurify.sanitize(input.trim()) : input;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return;

    // Validate email
    const sanitizedEmail = sanitizeInput(email);
    if (!validateEmail(sanitizedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const sanitizedEmail = email.trim().toLowerCase();
      console.log("Sanitized Email:", sanitizedEmail);
      
      const res = await axios.post(
        `${import.meta.env.VITE_API_AUTH_URL}/api/auth/forgot-password?email=${encodeURIComponent(
          sanitizedEmail
        )}`
      );
      
      // Log the response data for debugging
      console.log("Response data:", res.data);
      
      // Handle different response scenarios based on the response format
      if (res.data.success) {
        // Success case: Reset email sent
        toast.success(DOMPurify.sanitize(res.data.data || res.data.message));
        setEmail(""); // Clear input after success
      } else {
        // Handle the "Token Already Sent" case - this is not an error but a notification
        if (res.data.message === "Token Already Sent") {
          toast.info(DOMPurify.sanitize(res.data.data));
        } else {
          // This covers any other error cases like "User Not Found"
          toast.error(DOMPurify.sanitize(res.data.data || res.data.message));
        }
      }
    } catch (err) {
      console.error("Error:", err);
      
      // Display error message as toast
      const errorMessage =
        err.response?.data?.message || "Failed to send reset link. Try again.";
      toast.error(DOMPurify.sanitize(errorMessage));
    
      // Handle specific error cases
      if (err.response?.status === 429) {
        toast.error("Too many attempts. Please try again later.");
      } else if (err.response?.status === 404) {
        toast.error("Email not found in our records.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="relative flex h-screen w-full items-center justify-center">
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
      <div className="relative z-10 flex w-[90%] max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden">
        {/* Left Side - Image */}
        <div className="hidden md:flex w-1/2 items-center justify-center overflow-hidden rounded-[1.5rem]">
          <img
            src="https://img.freepik.com/free-vector/product-iteration-concept-illustration_114360-4725.jpg?t=st=1743068507~exp=1743072107~hmac=8e0807762af47584cd080e1242decc31a5572c09a6bc3a172bfe842c5bd5eafa&w=826"
            alt="Professional"
            className="w-full h-full object-contain rounded-[1.5rem]"
          />
        </div>

        {/* Right Side - ForgetPassword Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <div className="w-[25rem] flex flex-col rounded-lg bg-white text-gray-600 shadow-xl">
            {/* Header */}
            <div className="flex flex-col mb-6 items-center justify-center">
              <img
                src={logo}
                alt="Forget Password Logo"
                className="h-28 w-28 rounded-full"
              />
              <span className="mt-2 text-lg font-bold">
                SLTT
              </span>
              <span className="mt-2 text-lg font-semibold">
                Enter your email to reset password
              </span>
            </div>

            {/* Form Inputs */}
            <div className="p-6 flex flex-col gap-4">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your Email"
                className="border border-gray-400 outline-none text-gray-700 font-normal text-sm p-3 rounded-md w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="uppercase font-bold text-xs mt-4 text-white py-3 rounded-md w-full bg-gradient-to-tr from-blue-600 to-blue-400 hover:opacity-90 active:scale-95 transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Link"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
