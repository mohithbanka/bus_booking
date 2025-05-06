import React, { useState } from "react";

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
      {
        question: "Can I track the location of my booked bus online?",
        answer:
          "Yes, you can track your bus in real-time using our app or website. After booking, access the 'Track My Bus' feature with your ticket details.",
      },
      {
        question: "What are the advantages of purchasing a bus ticket with redBus?",
        answer:
          "Booking with redBus offers convenience, a wide selection of bus operators, secure payments, real-time tracking, and 24/7 customer support.",
      },
      {
        question: "Why book bus tickets online on redBus?",
        answer:
          "Online booking is quick, allows seat selection, offers exclusive discounts, and eliminates the need to visit a ticket counter.",
      },
      {
        question: "Do I need to create an account on the redBus site to book my bus ticket?",
        answer:
          "No, you can book as a guest, but creating an account provides benefits like faster bookings, trip history, and personalized offers.",
      },
    ],
    "Ticket-related": [
      {
        question: "How do I cancel my ticket?",
        answer:
          "Visit the 'My Bookings' section, select your ticket, and click 'Cancel.' Refund eligibility depends on the operator’s policy.",
      },
      {
        question: "Can I reschedule my trip?",
        answer:
          "Rescheduling depends on the bus operator’s policy. Check the 'My Bookings' section or contact support for assistance.",
      },
    ],
    Payment: [
      {
        question: "What payment methods are accepted?",
        answer:
          "We accept credit/debit cards, UPI, net banking, and digital wallets like Paytm and Google Pay.",
      },
      {
        question: "Is online payment secure?",
        answer:
          "Yes, our platform uses SSL encryption and complies with PCI-DSS standards to ensure secure transactions.",
      },
    ],
    "Cancellation & Refund": [
      {
        question: "What is the refund policy?",
        answer:
          "Refunds depend on the operator’s cancellation policy, typically processed within 5-7 business days if cancellation is allowed.",
      },
      {
        question: "How do I apply for a refund?",
        answer:
          "Cancel your ticket in the 'My Bookings' section, and the refund will be automatically processed to your original payment method.",
      },
    ],
  };

  const toggleQuestion = (question) => {
    setExpandedQuestion(expandedQuestion === question ? null : question);
  };

  return (
    <section
      className="bg-white py-12 px-4 sm:px-6 lg:px-10"
      aria-labelledby="faq-title"
    >
      <div className="max-w-4xl mx-auto">
        <h1
          id="faq-title"
          className="text-3xl sm:text-4xl font-bold text-primary text-center mb-10"
        >
          FAQs Related to Bus Ticket Booking
        </h1>
        <div className="tabs flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md font-medium text-sm sm:text-base transition-all duration-300 ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-hover"
              } focus:outline-none focus:ring-2 focus:ring-primary`}
              onClick={() => setActiveTab(tab)}
              aria-current={activeTab === tab ? "true" : "false"}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="faq-content">
          {faqs[activeTab].map((faq, index) => (
            <div
              key={index}
              className="faq-item border-b border-gray-200 py-4"
              role="region"
              aria-labelledby={`faq-question-${index}`}
            >
              <button
                className="faq-question flex justify-between items-center w-full text-left text-lg font-medium text-gray-800 hover:text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                onClick={() => toggleQuestion(faq.question)}
                aria-expanded={expandedQuestion === faq.question}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                <span>{faq.question}</span>
                <span className="faq-toggle text-xl">
                  {expandedQuestion === faq.question ? "−" : "+"}
                </span>
              </button>
              {expandedQuestion === faq.question && (
                <div
                  className="faq-answer mt-3 text-gray-600 transition-all duration-300"
                  id={`faq-answer-${index}`}
                >
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;