import React from "react";
import { useNavigate } from "react-router-dom";

const UserInfoCard = ({ user }) => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/edit-profile"); // Navigate to edit profile page
  };

  // Format join date if available
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 transform hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 animate-fade-in">
        User Information
      </h3>

      {!user ? (
        <p className="text-gray-500 italic">Loading user data...</p>
      ) : (
        <div className="space-y-6">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full border-2 border-blue-200 shadow-md object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-16 h-16 rounded-full border-2 border-blue-200 shadow-md bg-blue-500 flex items-center justify-center text-white text-xl font-semibold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span>
            </div>
            <h4 className="text-xl font-semibold text-gray-700">{user.name}</h4>
          </div>

          {/* User Details */}
          <div className="grid grid-cols-1 gap-3 text-gray-700">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800">User ID:</span>
              <span className="truncate">{user.id}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800">Phone:</span>
                <span>{user.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800">Joined:</span>
              <span>{joinDate}</span>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={handleEditProfile}
            className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:scale-105 transition-all duration-300"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfoCard;