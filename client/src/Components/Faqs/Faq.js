import React, { useState } from "react";
import "./Faq.css";

const FAQ = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const tabs = [
    "General",
    "Ticket-related",
    "Payment",
    "Cancellation & Refund",

  ];

  const faqs = {
    General: [
      "Can I track the location of my booked bus online?",
      "What are the advantages of purchasing a bus ticket with redBus?",
      "Why book bus tickets online on redBus?",
      "Do I need to create an account on the redBus site to book my bus ticket?",
    ],
    "Ticket-related": [
      "How do I cancel my ticket?",
      "Can I reschedule my trip?",
    ],
    Payment: [
      "What payment methods are accepted?",
      "Is online payment secure?",
    ],
    "Cancellation & Refund": [
      "What is the refund policy?",
      "How do I apply for a refund?",
    ],
    // Insurance: [
    //   "What does the travel insurance cover?",
    //   "How do I claim insurance?",
    // ],
  };

  const toggleQuestion = (question) => {
    setExpandedQuestion(expandedQuestion === question ? null : question);
  };

  return (
    <div className="faq-container">
      <h1>FAQs related to Bus Tickets Booking</h1>
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="faq-content">
        {faqs[activeTab].map((question, index) => (
          <div key={index} className="faq-item">
            <div
              className="faq-question"
              onClick={() => toggleQuestion(question)}
            >
              <span>{question}</span>
              <span className="faq-toggle">
                {expandedQuestion === question ? "-" : "+"}
              </span>
            </div>
            {expandedQuestion === question && (
              <div className="faq-answer">
                <p>This is the answer to the question: {question}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
