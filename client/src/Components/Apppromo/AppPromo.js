import React from "react";
import googleplay from "./google-play-badge.png";
import appstore from "./pp-store-badge.png";
import qrCode from "./qrcode_localhost.png";

const AppPromo = () => {
  return (
    <section
      className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-10"
      aria-labelledby="app-promo-title"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-center justify-between">
        {/* Left Section */}
        <div className="content-left text-center lg:text-left lg:w-1/3">
          <h2
            id="app-promo-title"
            className="text-3xl sm:text-4xl font-bold text-primary mb-6"
          >
            Enjoy the App!
          </h2>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center justify-center lg:justify-start gap-3 text-lg text-gray-700">
              <span className="check-icon bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center">
                ✔
              </span>
              Quick access
            </li>
            <li className="flex items-center justify-center lg:justify-start gap-3 text-lg text-gray-700">
              <span className="check-icon bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center">
                ✔
              </span>
              Superior live tracking
            </li>
          </ul>
          <div className="ratings flex justify-center lg:justify-start gap-8">
            <div className="text-center">
              <p className="rating text-2xl font-semibold text-primary">4.5 ★</p>
              <p className="text-gray-600">50M+ downloads</p>
              <p className="text-gray-500">Play Store</p>
            </div>
            <div className="text-center">
              <p className="rating text-2xl font-semibold text-primary">4.6 ★</p>
              <p className="text-gray-600">50M+ downloads</p>
              <p className="text-gray-500">App Store</p>
            </div>
          </div>
        </div>

        {/* Middle Section (QR Code) */}
        <div className="content-middle text-center lg:w-1/3">
          <p className="text-lg font-medium text-gray-700 mb-4">Scan to download</p>
          <div className="qr-code">
            <img
              src={qrCode}
              alt="QR code to download the bus booking app"
              className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
              onError={(e) => (e.target.src = "/fallback-qr.png")} // Fallback image
            />
          </div>
        </div>

        {/* Right Section (Store Buttons) */}
        <div className="content-right text-center lg:w-1/3">
          <p className="text-lg font-medium text-gray-700 mb-4">Download the App on</p>
          <div className="store-buttons flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              aria-label="Download on Google Play"
            >
              <img
                src={googleplay}
                alt="Get it on Google Play"
                className="w-40 h-auto transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary rounded"
              />
            </a>
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              aria-label="Download on the App Store"
            >
              <img
                src={appstore}
                alt="Download on the App Store"
                className="w-40 h-auto transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary rounded"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromo;