import React from "react";
import AvailableBuses from "../Components/AvailableBuses/AvailableBuses";
import Sidebar from "../Components/SideBar/Sidebar";

const SearchPage = () => {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <div style={{ width: "250px", flexShrink: 0 }}>
        <Sidebar />
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          height: "100vh",
          padding: "20px", // Added padding for better spacing
        }}
      >
        <AvailableBuses />
      </div>
    </div>
  );
};

export default SearchPage;
