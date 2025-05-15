import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const REACT_APP_BACKEND_URL = "http://localhost:5000";

const HelpPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Sample help topics (can integrate with FAQ.jsx data)
  const helpTopics = [
    { title: "How to book a bus ticket", link: "/faqs#General" },
    { title: "Cancel or modify a booking", link: "/faqs#Cancellation & Refund" },
    { title: "Track my bus", link: "/faqs#General" },
    { title: "Payment issues", link: "/faqs#Payment" },
  ];

  const filteredTopics = helpTopics.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
      errors.email = "Valid email is required";
    if (!formData.message.trim()) errors.message = "Message is required";
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormStatus("submitting");
    try {
      const response = await axios.post(`${REACT_APP_BACKEND_URL}/api/contact`, formData, {
        timeout: 5000,
      });
      setFormStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setFormErrors({});
      setTimeout(() => setFormStatus(null), 3000);
    } catch (error) {
      setFormStatus("error");
      setFormErrors({
        submit: error.response?.data?.error || "Failed to send message. Please try again.",
      });
      setTimeout(() => setFormStatus(null), 3000);
    }
  };

  const openLiveChat = () => {
    if (window.Tawk_API) {
      window.Tawk_API.toggle();
    } else {
      alert("Live chat is currently unavailable. Please use the contact form or email us.");
    }
  };

  useEffect(() => {
    // Load Tawk.to script dynamically
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/YOUR_PROPERTY_ID/default"; // Replace with your Tawk.to ID
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  return (
    <motion.div
      className="flex min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <i className={`fa-solid ${isSidebarOpen ? "fa-times" : "fa-bars"}`}></i>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="p-6 sticky top-0">
          <h2 className="text-xl font-bold text-gray-800">Help Center</h2>
          <nav className="mt-4">
            <ul className="space-y-3">
              {[
                { label: "Home", icon: "fa-home", path: "/" },
                { label: "FAQs", icon: "fa-question-circle", path: "/faqs" },
                { label: "Contact Us", icon: "fa-envelope", scroll: "contact" },
                { label: "Live Chat", icon: "fa-comment", action: openLiveChat },
              ].map((item, index) => (
                <li key={index}>
                  <button
                    className="flex items-center text-primary hover:bg-gray-100 w-full text-left py-2 px-3 rounded-md transition-colors"
                    onClick={() =>
                      item.path
                        ? navigate(item.path)
                        : item.scroll
                        ? document.getElementById(item.scroll).scrollIntoView({ behavior: "smooth" })
                        : item.action()
                    }
                  >
                    <i className={`fa-solid ${item.icon} mr-2`}></i>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.section
          className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-lg shadow-lg mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">BusBooking Help Center</h1>
          <p className="text-lg mb-6">
            Get instant support for booking, tracking, or managing your bus trips. Search for help or contact our team!
          </p>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics (e.g., booking, refund)"
              className="w-full p-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Search help topics"
            />
            {searchQuery && (
              <div className="mt-2 bg-white text-gray-800 rounded-md shadow-md p-4">
                {filteredTopics.length > 0 ? (
                  <ul className="space-y-2">
                    {filteredTopics.map((topic, index) => (
                      <li key={index}>
                        <button
                          className="text-primary hover:underline"
                          onClick={() => {
                            navigate(topic.link);
                            setSearchQuery("");
                          }}
                        >
                          {topic.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No topics found. Try our FAQs or contact us.</p>
                )}
              </div>
            )}
          </div>
        </motion.section>

        {/* Popular Topics */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Popular Topics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {helpTopics.map((topic, index) => (
              <button
                key={index}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
                onClick={() => navigate(topic.link)}
              >
                <h3 className="text-lg font-medium text-primary">{topic.title}</h3>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          id="contact"
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-600 mb-6">
            Our support team is here to assist you with any questions or issues.
          </p>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Email",
                icon: "fa-envelope",
                content: (
                  <a href="mailto:support@busbooking.com" className="hover:underline">
                    support@busbooking.com
                  </a>
                ),
              },
              {
                title: "Phone",
                icon: "fa-phone",
                content: "+91-123-456-7890 (9 AM - 9 PM IST)",
              },
              {
                title: "Social Media",
                icon: "fa-share-alt",
                content: (
                  <div className="flex space-x-4">
                    <a href="https://twitter.com/busbooking" className="text-primary hover:text-primary-dark">
                      <i className="fa-brands fa-twitter text-xl"></i>
                    </a>
                    <a href="https://facebook.com/busbooking" className="text-primary hover:text-primary-dark">
                      <i className="fa-brands fa-facebook text-xl"></i>
                    </a>
                    <a href="https://instagram.com/busbooking" className="text-primary hover:text-primary-dark">
                      <i className="fa-brands fa-instagram text-xl"></i>
                    </a>
                  </div>
                ),
              },
              {
                title: "Live Chat",
                icon: "fa-comment",
                content: (
                  <button
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                    onClick={openLiveChat}
                  >
                    Start Live Chat
                  </button>
                ),
              },
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md shadow-sm">
                <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                  <i className={`fa-solid ${item.icon} mr-2 text-primary`}></i>
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.content}</p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <h3 className="text-lg font-medium text-gray-800 mb-4">Send Us a Message</h3>
          <form onSubmit={handleContactFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  formErrors.name ? "border-red-500" : ""
                }`}
                required
                aria-describedby="name-error"
              />
              {formErrors.name && (
                <p id="name-error" className="text-red-500 text-sm mt-1">
                  {formErrors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  formErrors.email ? "border-red-500" : ""
                }`}
                required
                aria-describedby="email-error"
              />
              {formErrors.email && (
                <p id="email-error" className="text-red-500 text-sm mt-1">
                  {formErrors.email}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  formErrors.message ? "border-red-500" : ""
                }`}
                required
                aria-describedby="message-error"
              ></textarea>
              {formErrors.message && (
                <p id="message-error" className="text-red-500 text-sm mt-1">
                  {formErrors.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className={`w-full bg-primary text-white px-4 py-3 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                formStatus === "submitting" ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={formStatus === "submitting"}
            >
              {formStatus === "submitting" ? "Sending..." : "Send Message"}
            </button>
            {formStatus === "success" && (
              <p className="text-green-600 text-center">
                Message sent successfully! We'll respond within 24 hours.
              </p>
            )}
            {formStatus === "error" && (
              <p className="text-red-600 text-center">{formErrors.submit}</p>
            )}
          </form>
        </motion.section>

        {/* Floating Chat Bubble */}
        <motion.button
          className="fixed bottom-4 right-4 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={openLiveChat}
          aria-label="Open live chat"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          <i className="fa-solid fa-comment text-xl"></i>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HelpPage;