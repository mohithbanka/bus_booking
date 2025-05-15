import React, { useState, useMemo } from "react";

const Sidebar = ({ filters, onFilterChange, buses = [] }) => {
  const [expandedSections, setExpandedSections] = useState({
    liveTracking: true,
    primoBus: true,
    departureTime: true,
    busTypes: true,
    seatAvailability: true,
    arrivalTime: true,
  });

  const parseTime = (timeString) => {
    if (!timeString) return null;
    if (timeString.includes("T")) {
      return parseInt(timeString.split("T")[1].split(":")[0], 10);
    }
    return null;
  };

  const handleFilterChange = (category, key, value) => {
    const newFilters = {
      ...filters,
      [category]:
        category === "departureTime" ||
        category === "busTypes" ||
        category === "arrivalTime"
          ? { ...filters[category], [key]: value }
          : value,
    };
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
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
    };
    onFilterChange(clearedFilters);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const filterSections = useMemo(() => {
    const countBuses = (condition) => buses.filter(condition).length;

    return [
      {
        title: `Live Tracking (${countBuses((bus) => bus.liveTracking)})`,
        key: "liveTracking",
        options: [{ label: "Live Tracking", key: "liveTracking" }],
      },
      {
        title: `Primo Bus (${countBuses((bus) => bus.primo)})`,
        key: "primoBus",
        options: [{ label: "Primo Bus", key: "primoBus" }],
      },
      {
        title: "Departure Time",
        key: "departureTime",
        options: [
          {
            label: `Before 6 am (${countBuses(
              (bus) => parseTime(bus.departureTime) < 6
            )})`,
            key: "before6am",
          },
          {
            label: `6 am to 12 pm (${countBuses(
              (bus) =>
                parseTime(bus.departureTime) >= 6 &&
                parseTime(bus.departureTime) < 12
            )})`,
            key: "morning",
          },
          {
            label: `12 pm to 6 pm (${countBuses(
              (bus) =>
                parseTime(bus.departureTime) >= 12 &&
                parseTime(bus.departureTime) < 18
            )})`,
            key: "afternoon",
          },
          {
            label: `After 6 pm (${countBuses(
              (bus) => parseTime(bus.departureTime) >= 18
            )})`,
            key: "after6pm",
          },
        ],
      },
      {
        title: "Bus Types",
        key: "busTypes",
        options: [
          {
            label: `Seater (${countBuses(
              (bus) => bus.type?.toLowerCase().includes("seater")
            )})`,
            key: "seater",
          },
          {
            label: `Sleeper (${countBuses(
              (bus) => bus.type?.toLowerCase().includes("sleeper")
            )})`,
            key: "sleeper",
          },
          {
            label: `AC (${countBuses(
              (bus) => bus.type?.toLowerCase().includes("ac")
            )})`,
            key: "ac",
          },
          {
            label: `NonAC (${countBuses(
              (bus) => bus.type?.toLowerCase().includes("nonac") || !bus.type?.toLowerCase().includes("ac")
            )})`,
            key: "nonAc",
          },
        ],
      },
      {
        title: `Seat Availability (${countBuses(
          (bus) => bus.seatsAvailable >= 1
        )})`,
        key: "seatAvailability",
        options: [{ label: "Single Seats", key: "singleSeats" }],
      },
      {
        title: "Arrival Time",
        key: "arrivalTime",
        options: [
          {
            label: `Before 6 am (${countBuses(
              (bus) => {
                const arrival = new Date(new Date(bus.departureTime).getTime() + bus.routeId.duration * 60 * 1000);
                return arrival.getUTCHours() < 6;
              }
            )})`,
            key: "before6am",
          },
          {
            label: `6 am to 12 pm (${countBuses(
              (bus) => {
                const arrival = new Date(new Date(bus.departureTime).getTime() + bus.routeId.duration * 60 * 1000);
                const hour = arrival.getUTCHours();
                return hour >= 6 && hour < 12;
              }
            )})`,
            key: "morning",
          },
          {
            label: `12 pm to 6 pm (${countBuses(
              (bus) => {
                const arrival = new Date(new Date(bus.departureTime).getTime() + bus.routeId.duration * 60 * 1000);
                const hour = arrival.getUTCHours();
                return hour >= 12 && hour < 18;
              }
            )})`,
            key: "afternoon",
          },
          {
            label: `After 6 pm (${countBuses(
              (bus) => {
                const arrival = new Date(new Date(bus.departureTime).getTime() + bus.routeId.duration * 60 * 1000);
                return arrival.getUTCHours() >= 18;
              }
            )})`,
            key: "after6pm",
          },
        ],
      },
    ];
  }, [buses]);

  return (
    <aside className="h-full w-full bg-white p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Filter Buses</h2>
        <button
          onClick={handleClearFilters}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
        >
          Clear All
        </button>
      </div>
      {filterSections.map((section) => (
        <div key={section.key} className="mb-6">
          <h3
            className="flex justify-between items-center text-lg font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => toggleSection(section.key)}
            aria-expanded={expandedSections[section.key]}
            aria-controls={`filter-${section.key}`}
          >
            {section.title}
            <span
              className={`text-xs transform transition-transform duration-300 ${
                expandedSections[section.key] ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </h3>
          {expandedSections[section.key] && (
            <div
              id={`filter-${section.key}`}
              className="mt-2 space-y-2 animate-slide-down"
            >
              {section.options.map((option) => (
                <label
                  key={option.key}
                  className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-blue-500 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={
                      section.key === "departureTime" ||
                      section.key === "busTypes" ||
                      section.key === "arrivalTime"
                        ? filters[section.key][option.key]
                        : filters[section.key]
                    }
                    onChange={(e) =>
                      handleFilterChange(section.key, option.key, e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;