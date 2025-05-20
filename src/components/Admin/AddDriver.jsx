import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "./AdminNavbar";
import Footer from "../common/Footer";
import { useNavigate } from "react-router-dom";

function AddDriver() {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    licenseNumber: "",
    available: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Email validation regex
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Name validation (only letters and spaces)
    if (name === "name" && !/^[a-zA-Z\s]*$/.test(value)) {
      return;
    }

    // Mobile number validation (only digits)
    if (name === "mobileNumber" && !/^\d*$/.test(value)) {
      return;
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Get input class with consistent styling
  const getInputClass = (fieldName) => {
    return "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 text-sm tracking-tight font-medium";
  };

  // Comprehensive form validation with sequential error handling
  const validateForm = () => {
    // Validate Driver Name first
    if (!formData.name.trim()) {
      toast.error("Driver name is required", {
        position: "top-right",
        className: "text-sm font-medium tracking-tight",
      });
      return false;
    }

    if (formData.name.trim().length <= 2) {
      toast.error("Driver name must be greater than 2 characters", {
        position: "top-right",
        className: "text-sm font-medium tracking-tight",
      });
      return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      toast.error("Driver name must contain only letters and spaces", {
        position: "top-right",
        className: "text-sm font-medium tracking-tight",
      });
      return false;
    }

    // Validate Mobile Number
    if (!formData.mobileNumber.trim()) {
      toast.error("Mobile number is required", {
        position: "top-right",
        className: "text-sm font-medium tracking-tight",
      });
      return false;
    }

    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      toast.error("Mobile number must be exactly 10 digits", {
        position: "top-right",
        className: "text-sm font-medium tracking-tight",
      });
      return false;
    }

    // Validate Email
    if (!formData.email.trim()) {
      toast.error("Email address is required", {
        position: "top-right",
        className: "text-sm font-medium tracking-tight",
      });
      return false;
    }

    if (!EMAIL_REGEX.test(formData.email.trim())) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        className: "text-sm font-medium tracking-tight",
      });
      return false;
    }

    // Validate License Number
    if (!formData.licenseNumber.trim()) {
      toast.error("License number is required", {
        position: "top-right",
        className: "text-sm font-medium tracking-tight",
      });
      return false;
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(formData.licenseNumber)) {
      toast.error("License number must contain only letters, numbers, and spaces", {
        position: "top-right",
        className: "text-sm font-medium tracking-tight",
      });
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    console.log("Form data before submission:", formData);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/drivers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Driver added successfully:", data);
      toast.success("Driver added successfully!", {
        position: "top-right",
        className: "text-sm font-medium tracking-tight",
      });
      navigate("/drivermanage");

      // Reset form after successful submission
      setFormData({
        name: "",
        mobileNumber: "",
        email: "",
        licenseNumber: "",
        available: true,
      });
    } catch (error) {
      console.error("Error adding driver:", error);
      toast.error(`Failed to add driver: ${error.message}`, {
        position: "top-right",
        className: "text-sm font-medium tracking-tight",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-16">
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

        <div className="max-w-lg w-full mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Add New Driver
            </h2>
            <p className="mt-2 text-sm text-gray-600 font-medium tracking-tight">
              Enter driver details to register in the system
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Driver Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 tracking-tight">
                      Driver Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={getInputClass("name")}
                      placeholder="Enter driver's full name"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 tracking-tight">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      className={getInputClass("mobileNumber")}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 tracking-tight">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={getInputClass("email")}
                      placeholder="Enter driver's email address"
                    />
                  </div>

                  {/* License Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 tracking-tight">
                      License Number
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className={getInputClass("licenseNumber")}
                      placeholder="Enter valid license number"
                    />
                  </div>

                  {/* Availability */}
                  <div className="flex items-center">
                    <input
                      id="available"
                      name="available"
                      type="checkbox"
                      checked={formData.available}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="available"
                      className="ml-2 block text-sm text-gray-700 font-medium tracking-tight"
                    >
                      Driver is available for assignments
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-semibold tracking-tight ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? "Adding Driver..." : "Add Driver"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
export default AddDriver;