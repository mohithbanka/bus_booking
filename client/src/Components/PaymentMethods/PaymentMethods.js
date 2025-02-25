import React from "react";
import "./PaymentMethods.css";

const PaymentMethods = () => {
  const paymentMethods = [
    { id: 1, type: "Credit Card", details: "**** **** **** 1234" },
    { id: 2, type: "UPI", details: "john.doe@upi" },
  ];

  return (
    <div className="payment-methods">
      <h3>Saved Payment Methods</h3>
      <ul>
        {paymentMethods.map((method) => (
          <li key={method.id}>
            <p>{method.type}</p>
            <p>{method.details}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentMethods;
