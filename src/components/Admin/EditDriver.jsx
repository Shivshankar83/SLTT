import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "./AdminNavbar";
import Footer from "../common/Footer";

const EditDriver = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    mobileNumber: "",
    licenseNumber: "",
    available: false,
  });

  // Fetch driver details
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/drivers/${id}`
        );
        setFormData(response.data);
      } catch (err) {
        setError("Failed to fetch driver details. Please try again later.");
        toast.error("Failed to load driver details");
        console.error("Error fetching driver:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDriver();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const getInputClass = (fieldName) => {
    return `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      toast.error("Driver name is required");
      return;
    }
    
    if (!formData.mobileNumber.trim() || formData.mobileNumber.length !== 10) {
      toast.error("Valid 10-digit mobile number is required");
      return;
    }
    
    if (!formData.licenseNumber.trim()) {
      toast.error("License number is required");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/drivers/${id}`,
        formData
      );
      
      if (response.status === 200) {
        toast.success("Driver updated successfully!");
        // Navigate back to driver management page after successful update
        setTimeout(() => {
          navigate("/admin/drivers");
        }, 2000);
      }
    } catch (err) {
      console.error("Error updating driver:", err);
      toast.error("Failed to update driver. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-20">
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
            <h2 className="text-3xl font-extrabold text-gray-900">
              Edit Driver
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Update driver details in the system
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Driver ID - Hidden */}
                  <input type="hidden" name="id" value={formData.id} />
                  
                  {/* Driver Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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

                  {/* License Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Driver is available for assignments
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? "Updating Driver..." : "Update Driver"}
                    </button>
                  </div>
                  
                  {/* Back Button */}
                  <div>
                    <button
                      type="button"
                      onClick={() => navigate("/admin/drivers")}
                      className="w-full mt-3 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                      Cancel
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
};

export default EditDriver;