import React, { useState } from "react";
import Sidebar from "../Components/SideBar/Sidebar";
import AvailableBuses from "../Components/AvailableBuses/AvailableBuses";

const SearchPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Toggle Button for Mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <i className={`fa-solid ${isSidebarOpen ? "fa-times" : "fa-bars"}`}></i>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <AvailableBuses />
      </div>
    </div>
  );
};

export default SearchPage;