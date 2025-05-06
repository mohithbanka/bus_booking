import React, { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      setSubscriptionStatus("error");
      return;
    }
    // Simulate newsletter subscription (replace with actual API call)
    setTimeout(() => {
      setSubscriptionStatus("success");
      setEmail("");
    }, 1000);
  };

  return (
    <footer
      className="bg-primary text-white py-12 px-4 sm:px-6 lg:px-10"
      aria-labelledby="footer-title"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Contact Section */}
        <div className="footer-section">
          <h3
            id="footer-title"
            className="text-xl font-semibold mb-4 border-b border-white/20 pb-2"
          >
            Contact Us
          </h3>
          <p className="text-gray-200 mb-4">
            redBus is the world's largest online bus ticket booking service
            trusted by over 25 million happy customers globally. redBus offers
            bus ticket booking through its website, iOS, and Android mobile apps
            for all major routes.
          </p>
          <p className="mb-2">
            Customer Support:{" "}
            <a
              href="tel:+1800123456"
              className="hover:text-secondary transition-colors duration-300"
              aria-label="Call customer support at +1 800 123 456"
            >
              +1 800 123 456
            </a>
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:support@busbooking.com"
              className="hover:text-secondary transition-colors duration-300"
              aria-label="Email support at support@busbooking.com"
            >
              support@busbooking.com
            </a>
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h3 className="text-xl font-semibold mb-4 border-b border-white/20 pb-2">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <a
                href="/terms"
                className="text-gray-200 hover:text-secondary transition-colors duration-300"
              >
                Terms & Conditions
              </a>
            </li>
            <li>
              <a
                href="/privacy"
                className="text-gray-200 hover:text-secondary transition-colors duration-300"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="text-gray-200 hover:text-secondary transition-colors duration-300"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="text-gray-200 hover:text-secondary transition-colors duration-300"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className="footer-section">
          <h3 className="text-xl font-semibold mb-4 border-b border-white/20 pb-2">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-gray-200 mb-4">
            Stay updated with the latest offers and travel tips.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-300"
              aria-label="Email for newsletter subscription"
            />
            <button
              type="submit"
              className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-300"
            >
              Subscribe
            </button>
          </form>
          {subscriptionStatus === "success" && (
            <p className="text-green-300 mt-2">Subscribed successfully!</p>
          )}
          {subscriptionStatus === "error" && (
            <p className="text-red-300 mt-2">Please enter a valid email.</p>
          )}
        </div>

        {/* Social Media Section */}
        <div className="footer-section">
          <h3 className="text-xl font-semibold mb-4 border-b border-white/20 pb-2">
            Follow Us
          </h3>
          <div className="social-icons flex gap-4">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-secondary transition-colors duration-300"
              aria-label="Follow us on Facebook"
            >
              <i className="fa-brands fa-facebook-f text-xl"></i>
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-secondary transition-colors duration-300"
              aria-label="Follow us on Twitter"
            >
              <i className="fa-brands fa-twitter text-xl"></i>
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-secondary transition-colors duration-300"
              aria-label="Follow us on Instagram"
            >
              <i className="fa-brands fa-instagram text-xl"></i>
            </a>
          </div>
        </div>
      </div>
      {/* Copyright Section */}
      <div className="mt-10 text-center text-gray-300 border-t border-white/20 pt-6">
        <p>© {new Date().getFullYear()} BusBooking. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
