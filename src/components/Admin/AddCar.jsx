import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Footer from "../common/Footer";
import axios from "axios";

export default function Addcar() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Details
    make: "",
    model: "",
    ratePerKm: "", // Added new field
    discountRatePerKm: "", // Added new field

    // Insurance Details
    insurance: {
      provider: "",
      policyNumber: "",
      expiry: "",
    },

    // Location
    location: {
      latitude: 0,
      longitude: 0,
      address: "",
    },

    // Maintenance History - array of maintenance records
    maintenanceHistory: [
      {
        date: "",
        description: "",
        cost: 0,
        vendor: "",
        partsUsed: [""],
        laborHours: 0,
      },
    ],
  });

  // Current maintenance entry being edited (index)
  const [currentMaintenanceIndex, setCurrentMaintenanceIndex] = useState(0);

  // Temporary state for the maintenance entry being edited
  const [tempMaintenanceEntry, setTempMaintenanceEntry] = useState({
    date: "",
    description: "",
    cost: 0,
    vendor: "",
    partsUsed: [""],
    laborHours: 0,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle change for basic form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      if (parent === "insurance" || parent === "location") {
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: value,
          },
        });
      } else if (parent === "maintenance") {
        // For maintenance fields, update the temp entry
        let fieldValue = value;

        // Convert to number if needed
        if (child === "cost" || child === "laborHours") {
          fieldValue = value === "" ? "" : parseFloat(value);
        }

        setTempMaintenanceEntry({
          ...tempMaintenanceEntry,
          [child]: fieldValue,
        });
      }
    } else if (name === "parts") {
      // Fix for parts used - handle empty string properly
      const partsArray = value.trim() === "" ? [] : value.split(",").map((part) => part.trim());
      setTempMaintenanceEntry({
        ...tempMaintenanceEntry,
        partsUsed: partsArray,
      });
    } else {
      // For basic fields including the new rate fields
      let fieldValue = value;
      
      // Convert to number for rate fields if needed
      if (name === "ratePerKm" || name === "discountRatePerKm") {
        fieldValue = value === "" ? "" : parseFloat(value);
      }
      
      setFormData({
        ...formData,
        [name]: fieldValue,
      });
    }
  };

  // Special handler for maintenance date
  const handleMaintenanceDateChange = (e) => {
    const { value } = e.target;
    setTempMaintenanceEntry({
      ...tempMaintenanceEntry,
      date: value,
    });
  };

  // Initialize editing of a maintenance entry
  const editMaintenanceEntry = (index) => {
    setCurrentMaintenanceIndex(index);
    setTempMaintenanceEntry({
      ...formData.maintenanceHistory[index],
    });
  };

  // Add a new maintenance entry to the form
  const addNewMaintenanceEntry = () => {
    // Save current entry first if it has data
    saveCurrentMaintenanceEntry();

    // Create new empty entry
    const newEntry = {
      date: "",
      description: "",
      cost: "",
      vendor: "",
      partsUsed: [""],
      laborHours: "",
    };

    // Add it to the maintenance history
    const updatedHistory = [...formData.maintenanceHistory, newEntry];
    setFormData({
      ...formData,
      maintenanceHistory: updatedHistory,
    });

    // Set it as the current entry
    setCurrentMaintenanceIndex(updatedHistory.length - 1);
    setTempMaintenanceEntry(newEntry);
  };

  // Save the current maintenance entry
  const saveCurrentMaintenanceEntry = () => {
    if (validateMaintenanceEntry()) {
      const updatedHistory = [...formData.maintenanceHistory];
      updatedHistory[currentMaintenanceIndex] = { ...tempMaintenanceEntry };

      setFormData({
        ...formData,
        maintenanceHistory: updatedHistory,
      });

      // Show success toast with auto-close
      toast.success("Maintenance entry saved!", {
        autoClose: 3000
      });
      return true;
    }
    return false;
  };

  // Remove a maintenance entry
  const removeMaintenanceEntry = (index) => {
    // Don't allow removing the last entry
    if (formData.maintenanceHistory.length <= 1) {
      toast.error("At least one maintenance record is required.", {
        autoClose: 3000
      });
      return;
    }

    const updatedHistory = formData.maintenanceHistory.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      maintenanceHistory: updatedHistory,
    });

    // If we deleted the current entry, select the first one
    if (index === currentMaintenanceIndex) {
      setCurrentMaintenanceIndex(0);
      setTempMaintenanceEntry({ ...updatedHistory[0] });
    }
    // If we deleted an entry before the current one, adjust the index
    else if (index < currentMaintenanceIndex) {
      setCurrentMaintenanceIndex(currentMaintenanceIndex - 1);
    }

    toast.info("Maintenance entry removed", {
      autoClose: 3000
    });
  };

  // Validate a single maintenance entry
  const validateMaintenanceEntry = () => {
    const newErrors = {};
    let errorMessage = "";

    if (!tempMaintenanceEntry.date) {
      newErrors["maintenance.date"] = true;
      errorMessage = "Maintenance date is required";
    } else if (
      !tempMaintenanceEntry.description ||
      !tempMaintenanceEntry.description.trim()
    ) {
      newErrors["maintenance.description"] = true;
      errorMessage = "Description is required";
    } else if (
      tempMaintenanceEntry.cost === "" ||
      isNaN(tempMaintenanceEntry.cost)
    ) {
      newErrors["maintenance.cost"] = true;
      errorMessage = "Valid cost is required";
    } else if (
      !tempMaintenanceEntry.vendor ||
      !tempMaintenanceEntry.vendor.trim()
    ) {
      newErrors["maintenance.vendor"] = true;
      errorMessage = "Vendor is required";
    } else if (
      tempMaintenanceEntry.laborHours === "" ||
      isNaN(tempMaintenanceEntry.laborHours)
    ) {
      newErrors["maintenance.laborHours"] = true;
      errorMessage = "Valid labor hours are required";
    } else if (
      !tempMaintenanceEntry.partsUsed || 
      tempMaintenanceEntry.partsUsed.length === 0 ||
      (tempMaintenanceEntry.partsUsed.length === 1 && tempMaintenanceEntry.partsUsed[0].trim() === "")
    ) {
      newErrors["maintenance.partsUsed"] = true;
      errorMessage = "At least one part must be entered";
    }

    if (Object.keys(newErrors).length > 0) {
      toast.error(errorMessage, {
        autoClose: 3000
      });
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const validateStep = (step) => {
    const newErrors = {};
    let errorMessage = "";

    if (step === 1) {
      // Basic Details Validation
      if (!formData.make.trim()) {
        newErrors["make"] = true;
        errorMessage = "Make is required";
      } else if (!formData.model.trim()) {
        newErrors["model"] = true;
        errorMessage = "Model is required";
      } else if (formData.ratePerKm === "" || isNaN(formData.ratePerKm) || formData.ratePerKm < 0) {
        newErrors["ratePerKm"] = true;
        errorMessage = "Valid rate per km is required";
      } else if (formData.discountRatePerKm === "" || isNaN(formData.discountRatePerKm) || formData.discountRatePerKm < 0) {
        newErrors["discountRatePerKm"] = true;
        errorMessage = "Valid discount rate per km is required";
      }
      // Insurance Validation
      else if (!formData.insurance.provider.trim()) {
        newErrors["insurance.provider"] = true;
        errorMessage = "Insurance provider is required";
      } else if (!formData.insurance.policyNumber.trim()) {
        newErrors["insurance.policyNumber"] = true;
        errorMessage = "Policy number is required";
      } else if (!formData.insurance.expiry) {
        newErrors["insurance.expiry"] = true;
        errorMessage = "Expiry date is required";
      }
    } else if (step === 2) {
      // Location Validation
      if (
        formData.location.latitude === "" ||
        isNaN(formData.location.latitude)
      ) {
        newErrors["location.latitude"] = true;
        errorMessage = "Valid latitude is required";
      } else if (
        formData.location.longitude === "" ||
        isNaN(formData.location.longitude)
      ) {
        newErrors["location.longitude"] = true;
        errorMessage = "Valid longitude is required";
      } else if (!formData.location.address.trim()) {
        newErrors["location.address"] = true;
        errorMessage = "Address is required";
      }
    }

    // Show toast for errors with auto-close
    if (Object.keys(newErrors).length > 0) {
      toast.error(errorMessage, {
        autoClose: 3000
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);

      // When moving to step 3, initialize the maintenance form
      if (currentStep === 2) {
        setTempMaintenanceEntry({ ...formData.maintenanceHistory[0] });
      }

      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      // Save maintenance entry if leaving step 3
      if (currentStep === 3) {
        saveCurrentMaintenanceEntry();
      }

      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Save the current maintenance entry first
    const entrySaved = saveCurrentMaintenanceEntry();
    if (!entrySaved) return;

    // Check if we have at least one valid maintenance entry
    if (formData.maintenanceHistory.length === 0) {
      toast.error("At least one maintenance record is required", {
        autoClose: 3000
      });
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/cars`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        // Display success message from the API response
        toast.success(response.data.message || "Car added successfully!", {
          autoClose: 3000
        });
        
        // Reset form
        setFormData({
          make: "",
          model: "",
          ratePerKm: "",
          discountRatePerKm: "",
          insurance: {
            provider: "",
            policyNumber: "",
            expiry: "",
          },
          location: {
            latitude: 0,
            longitude: 0,
            address: "",
          },
          maintenanceHistory: [
            {
              date: "",
              description: "",
              cost: "",
              vendor: "",
              partsUsed: [""],
              laborHours: "",
            },
          ],
        });
    
        setCurrentStep(1);
        setTimeout(() => {
          navigate("/admin");
        }, 1500);
      } else {
        // Should not normally reach here as axios throws for non-2xx status codes
        // But just in case, display the error message from the response if available
        toast.error(response.data?.message || "Unexpected response from server. Please try again.", {
          autoClose: 3000
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      
      // More detailed error handling with auto-close
      if (error.response) {
        // Get the error message from the response if available
        const errorMessage = error.response.data?.message || 
                           `Error: ${error.response.status} - ${error.response.statusText}`;
        toast.error(errorMessage, {
          autoClose: 3000
        });
      } else if (error.request) {
        toast.error("No response received from server. Please check your connection.", {
          autoClose: 3000
        });
      } else {
        toast.error(`Failed to add car: ${error.message}`, {
          autoClose: 3000
        });
      }
    }
  };

  // Helper function to add error highlighting to inputs
  const getInputClass = (fieldName) => {
    return `w-full p-2 border rounded-md ${
      errors[fieldName] ? "border-red-300 bg-red-50" : "border-gray-300"
    }`;
  };

  return (
    <>
      <AdminNavbar />
      <div className="mt-20">
        <div className="max-w-4xl mt-4 mx-auto p-4 bg-white rounded-lg shadow-lg">
          {/* Toast Container with autoClose enabled */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <h1 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mb-6">
            Add Your Car
          </h1>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span
                className={`text-sm font-medium ${
                  currentStep >= 1 ? "text-blue-700" : "text-gray-500"
                }`}
              >
                Car Details
              </span>
              <span
                className={`text-sm font-medium ${
                  currentStep >= 2 ? "text-blue-700" : "text-gray-500"
                }`}
              >
                Location
              </span>
              <span
                className={`text-sm font-medium ${
                  currentStep >= 3 ? "text-blue-700" : "text-gray-500"
                }`}
              >
                Maintenance
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Details & Insurance */}
            {currentStep === 1 && (
              <div className="bg-white p-4 rounded-lg border border-blue-500 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Car Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Make
                    </label>
                    <input
                      type="text"
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      className={getInputClass("make")}
                      placeholder="e.g., Toyota"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className={getInputClass("model")}
                      placeholder="e.g., Camry"
                    />
                  </div>
                  
                  {/* New Rate Per Km Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rate Per Km
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      name="ratePerKm"
                      value={formData.ratePerKm}
                      onChange={handleChange}
                      className={getInputClass("ratePerKm")}
                      placeholder="e.g., 10"
                    />
                  </div>

                  {/* New Discount Rate Per Km Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Rate Per Km
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      name="discountRatePerKm"
                      value={formData.discountRatePerKm}
                      onChange={handleChange}
                      className={getInputClass("discountRatePerKm")}
                      placeholder="e.g., 1"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-medium mt-6 mb-3 text-gray-700">
                  Insurance Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provider
                    </label>
                    <input
                      type="text"
                      name="insurance.provider"
                      value={formData.insurance.provider}
                      onChange={handleChange}
                      className={getInputClass("insurance.provider")}
                      placeholder="e.g., State Farm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Policy Number
                    </label>
                    <input
                      type="text"
                      name="insurance.policyNumber"
                      value={formData.insurance.policyNumber}
                      onChange={handleChange}
                      className={getInputClass("insurance.policyNumber")}
                      placeholder="e.g., POL-12345"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      name="insurance.expiry"
                      value={formData.insurance.expiry}
                      onChange={handleChange}
                      className={getInputClass("insurance.expiry")}
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="bg-white p-4 rounded-lg border border-blue-500 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Location
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="location.latitude"
                      value={formData.location.latitude}
                      onChange={handleChange}
                      className={getInputClass("location.latitude")}
                      placeholder="e.g., 34.0522"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="location.longitude"
                      value={formData.location.longitude}
                      onChange={handleChange}
                      className={getInputClass("location.longitude")}
                      placeholder="e.g., -118.2437"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="location.address"
                      value={formData.location.address}
                      onChange={handleChange}
                      className={getInputClass("location.address")}
                      placeholder="e.g., 123 Main St, Los Angeles, CA 90001"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Maintenance History */}
            {currentStep === 3 && (
              <div className="bg-white p-4 rounded-lg border border-blue-500 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Maintenance History
                </h2>

                {/* Maintenance Records List */}
                {formData.maintenanceHistory.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-md font-medium mb-2 text-gray-700">
                      Saved Records
                    </h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                      {formData.maintenanceHistory.map((record, index) => (
                        <div
                          key={index}
                          className={`p-2 mb-2 border rounded flex items-center justify-between ${
                            index === currentMaintenanceIndex
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div>
                            <span className="font-medium">
                              {record.vendor || "No vendor"}
                            </span>{" "}
                            -
                            <span className="ml-2">
                              {record.date || "No date"}
                            </span>
                            <p className="text-sm text-gray-600 truncate max-w-md">
                              {record.description || "No description"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => editMaintenanceEntry(index)}
                              className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => removeMaintenanceEntry(index)}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form for current maintenance entry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="maintenance.date"
                      value={tempMaintenanceEntry.date}
                      onChange={handleMaintenanceDateChange}
                      className={getInputClass("maintenance.date")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vendor
                    </label>
                    <input
                      type="text"
                      name="maintenance.vendor"
                      value={tempMaintenanceEntry.vendor}
                      onChange={handleChange}
                      className={getInputClass("maintenance.vendor")}
                      placeholder="e.g., AutoShop"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="maintenance.description"
                      value={tempMaintenanceEntry.description}
                      onChange={handleChange}
                      className={getInputClass("maintenance.description")}
                      placeholder="e.g., Regular oil change and filter replacement"
                      rows="3"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="maintenance.cost"
                      value={tempMaintenanceEntry.cost}
                      onChange={handleChange}
                      className={getInputClass("maintenance.cost")}
                      placeholder="e.g., 89.99"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Labor Hours
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="maintenance.laborHours"
                      value={tempMaintenanceEntry.laborHours}
                      onChange={handleChange}
                      className={getInputClass("maintenance.laborHours")}
                      placeholder="e.g., 1.5"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parts Used (comma separated)
                    </label>
                    <input
                      type="text"
                      name="parts"
                      value={tempMaintenanceEntry.partsUsed.join(", ")}
                      onChange={handleChange}
                      className={`${getInputClass("maintenance.partsUsed")} w-full p-2 border rounded-md`}
                      placeholder="e.g., Oil filter, Engine oil, Air filter"
                    />
                  </div>
                </div>

                {/* Entry management buttons */}
                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={saveCurrentMaintenanceEntry}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    Save Entry
                  </button>
                  <button
                    type="button"
                    onClick={addNewMaintenanceEntry}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Add New Entry
                  </button>
                </div>

                {/* Form navigation */}
                <div className="mt-6 flex justify-between border-t pt-4">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}