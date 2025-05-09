import React, { useState } from "react";

const Sidebar = () => {
  const [filters, setFilters] = useState({
    liveTracking: false,
    primoBus: false,
    departureTime: {
      before6am: false,
      morning: false,
      afternoon: false,
      after6pm: false,
    },
    busTypes: {
      seater: false,
      sleeper: false,
      ac: false,
      nonAc: false,
    },
    seatAvailability: {
      singleSeats: false,
    },
    arrivalTime: {
      before6am: false,
      morning: false,
      afternoon: false,
      after6pm: false,
    },
  });

  const handleFilterChange = (category, key, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: category === "departureTime" || category === "busTypes" || category === "arrivalTime"
        ? { ...prev[category], [key]: value }
        : value,
    }));
  };

  const filterSections = [
    {
      title: "Live Tracking (30)",
      key: "liveTracking",
      options: [{ label: "Live Tracking", key: "liveTracking" }],
    },
    {
      title: "Primo Bus (9)",
      key: "primoBus",
      options: [{ label: "Primo Bus", key: "primoBus" }],
    },
    {
      title: "Departure Time",
      key: "departureTime",
      options: [
        { label: "Before 6 am (0)", key: "before6am" },
        { label: "6 am to 12 pm (0)", key: "morning" },
        { label: "12 pm to 6 pm (34)", key: "afternoon" },
        { label: "After 6 pm (12)", key: "after6pm" },
      ],
    },
    {
      title: "Bus Types",
      key: "busTypes",
      options: [
        { label: "Seater (23)", key: "seater" },
        { label: "Sleeper (39)", key: "sleeper" },
        { label: "AC (35)", key: "ac" },
        { label: "NonAC (11)", key: "nonAc" },
      ],
    },
    {
      title: "Seat Availability",
      key: "seatAvailability",
      options: [{ label: "Single Seats (35)", key: "singleSeats" }],
    },
    {
      title: "Arrival Time",
      key: "arrivalTime",
      options: [
        { label: "Before 6 am (32)", key: "before6am" },
        { label: "6 am to 12 pm (9)", key: "morning" },
        { label: "12 pm to 6 pm (0)", key: "afternoon" },
        { label: "After 6 pm (5)", key: "after6pm" },
      ],
    },
  ];

  return (
    <aside className="h-full bg-white p-6 overflow-y-auto">
      <h2 className="text-xl font-semibold text-primary mb-6">Filter Buses</h2>
      {filterSections.map((section) => (
        <div key={section.key} className="filter-section mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">{section.title}</h3>
          <div className="space-y-2">
            {section.options.map((option) => (
              <label
                key={option.key}
                className="flex items-center gap-2 text-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={
                    section.key === "departureTime" || section.key === "busTypes" || section.key === "arrivalTime"
                      ? filters[section.key][option.key]
                      : filters[section.key]
                  }
                  onChange={(e) =>
                    handleFilterChange(section.key, option.key, e.target.checked)
                  }
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;