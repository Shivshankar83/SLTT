import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Check,
  AlertCircle,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import Footer from "./Footer";
import CommonNavbar from "./CommonNavbar";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitted: false,
        error: true,
        message: "Please fill in all required fields.",
      });
      return;
    }

    // Simulate form submission
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        error: false,
        message: "Thank you for your message! We will get back to you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1000);
  };

  return (
    <>
      <CommonNavbar />
      <div className="bg-gradient-to-b from-blue-300 to-white dark:from-blue-400 dark:to-gray-700 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header with Animation */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-800 dark:text-blue-300 mb-4">
              Get In Touch
            </h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
              Have questions or need assistance? Our team is here to help you.
              We'll respond as quickly as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Card */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-t-4 border-blue-600 transform transition duration-300 hover:scale-105">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Contact Information
                </h3>

                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Email
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 mt-1 text-lg hover:text-blue-600 dark:hover:text-blue-200 transition-colors">
                        info@example.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Phone
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 mt-1 text-lg hover:text-blue-600 dark:hover:text-blue-200 transition-colors">
                        +1 (123) 456-7890
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Address
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        123 Business Street
                        <br />
                        Suite 100
                        <br />
                        New York, NY 10001
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                    Connect With Us
                  </h4>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 p-3 rounded-full text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 transition-all duration-300"
                    >
                      <Facebook className="h-5 w-5" />
                      <span className="sr-only">Facebook</span>
                    </a>
                    <a
                      href="#"
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 p-3 rounded-full text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 transition-all duration-300"
                    >
                      <Twitter className="h-5 w-5" />
                      <span className="sr-only">Twitter</span>
                    </a>
                    <a
                      href="#"
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 p-3 rounded-full text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 transition-all duration-300"
                    >
                      <Instagram className="h-5 w-5" />
                      <span className="sr-only">Instagram</span>
                    </a>
                    <a
                      href="#"
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 p-3 rounded-full text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 transition-all duration-300"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span className="sr-only">LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-t-4 border-blue-600">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Send us a Message
                </h3>

                {formStatus.submitted ? (
                  <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-500 dark:text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800 dark:text-green-300">
                          {formStatus.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {formStatus.error ? (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800 dark:text-red-300">
                          {formStatus.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Name <span className="text-red-500 dark:text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors duration-200"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Email <span className="text-red-500 dark:text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors duration-200"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Subject
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors duration-200"
                        placeholder="What is this regarding?"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Message <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors duration-200"
                        placeholder="Please tell us how we can help you..."
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-3 px-6 border border-transparent shadow-md text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="mt-16 bg-blue-600 dark:bg-blue-800 rounded-xl shadow-xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">
              Need Immediate Assistance?
            </h3>
            <p className="mb-6 max-w-2xl mx-auto">
              Our customer support team is available to help you Monday through
              Friday from 9:00 AM to 5:00 PM EST.
            </p>
            <a
              href="tel:+11234567890"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 dark:bg-blue-100 dark:text-blue-800 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-white transition-colors duration-300"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call Us Now
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;