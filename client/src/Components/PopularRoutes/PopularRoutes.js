import React from "react";
import { useNavigate } from "react-router-dom";

const PopularRoutes = () => {
  const navigate = useNavigate();
  const routes = [
    { from: "DELHI", to: "MUMBAI", date: "2025-05-16" },
    { from: "BANGALORE", to: "CHENNAI", date: "2025-05-16" },
    { from: "HYDERABAD", to: "PUNE", date: "2025-05-16" },
    { from: "KOLKATA", to: "BHUBANESWAR", date: "2025-05-16" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-12">
          Popular Bus Routes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {routes.map((route, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {route.from} to {route.to}
              </h3>
              <button
                onClick={() =>
                  navigate(
                    `/search?fromCity=${route.from}&toCity=${route.to}&travelDate=${route.date}`
                  )
                }
                className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRoutes;