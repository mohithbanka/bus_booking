import React, { useState } from "react";
const REACT_APP_BACKEND_URL = process.env.REACT_APP_API_URL ;
console.log("REACT_APP_BACKEND_URL:", REACT_APP_BACKEND_URL);

const PaymentMethods = ({ paymentMethods }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newMethod, setNewMethod] = useState({ type: "", details: "" });

  const handleAddMethod = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${REACT_APP_BACKEND_URL}/api/payment-methods`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMethod),
      });
      if (!response.ok) throw new Error("Failed to add payment method");
      const data = await response.json();
      // Update payment methods (e.g., refetch or append)
      setIsAdding(false);
      setNewMethod({ type: "", details: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Saved Payment Methods</h3>
      {paymentMethods.length === 0 ? (
        <p className="text-gray-500">No payment methods saved.</p>
      ) : (
        <ul className="space-y-4">
          {paymentMethods.map((method) => (
            <li
              key={method.id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition"
            >
              <div>
                <p className="text-lg font-medium text-gray-700">{method.type}</p>
                <p className="text-sm text-gray-500">{method.details}</p>
              </div>
              <button
                className="text-red-500 hover:text-red-700 text-sm"
                onClick={() => {
                  // Implement delete logic
                  console.log(`Delete method ${method.id}`);
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        onClick={() => setIsAdding(!isAdding)}
      >
        {isAdding ? "Cancel" : "Add Payment Method"}
      </button>
      {isAdding && (
        <form onSubmit={handleAddMethod} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <input
              type="text"
              value={newMethod.type}
              onChange={(e) => setNewMethod({ ...newMethod, type: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., Credit Card"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Details</label>
            <input
              type="text"
              value={newMethod.details}
              onChange={(e) => setNewMethod({ ...newMethod, details: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., **** **** **** 1234"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Save
          </button>
        </form>
      )}
    </div>
  );
};

export default PaymentMethods;