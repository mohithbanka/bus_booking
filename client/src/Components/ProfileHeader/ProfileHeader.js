import React from "react";

const ProfileHeader = ({ user }) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-10 md:py-14 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M30 0a30 30 0 1 0 0 60 30 30 0 0 0 0-60zm0 56a26 26 0 1 1 0-52 26 26 0 0 1 0 52z%22 fill=%22%23ffffff%22 fill-opacity=%220.05%22/%3E%3C/svg%3E')] opacity-20"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            {/* <img
              src={user?.avatar || "https://via.placeholder.com/100"}
              alt="User Avatar"
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border-3 border-white shadow-md object-cover transform hover:scale-105 transition-transform duration-300"
            /> */}
            {/* Online Indicator */}
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span>
          </div>
          {/* User Info */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight animate-fade-in">
              {user ? `${user.name}'s Profile` : "My Profile"}
            </h1>
            {user && (
              <p className="mt-2 text-base md:text-lg text-blue-100 animate-fade-in delay-100">
                Email: {user.email}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;