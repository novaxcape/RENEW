import "../components/css/Faq.css";
import React, { useState } from "react";

import { FaPlus, FaMinus } from "react-icons/fa";

const faqData = [
  {
    id: "01",
    question: "What is Novaxcape?",
    answer:
      "Novaxcape is a platform that helps users discover attractions, book tickets, and manage travel experiences easily.",
  },
  {
    id: "02",
    question: "Can I pay in installments?",
    answer:
      "Yes, installment payment options may be available for selected bookings.",
  },
  {
    id: "03",
    question: "How do I book a ticket?",
    answer:
      "Browse available attractions, select your preferred ticket, and proceed to checkout.",
  },
  {
    id: "04",
    question: "How do I use my digital ticket?",
    answer: "Present the QR code or ticket confirmation at the venue entrance.",
  },
  {
    id: "05",
    question: "Can I cancel my booking?",
    answer:
      "Cancellation policies vary depending on the attraction and booking type.",
  },
  {
    id: "06",
    question: "Are payments secure?",
    answer: "Yes, all payments are processed through secure payment gateways.",
  },
  {
    id: "07",
    question: "What tourism centers are available?",
    answer:
      "You can explore various attractions, landmarks, and tourism destinations listed on the platform.",
  },
  {
    id: "08",
    question: "Do I need an account to book?",
    answer:
      "Some bookings may require an account for easier ticket management.",
  },
  {
    id: "09",
    question: "What should I do if I encounter an issue?",
    answer:
      "Contact our support team through live chat, email, or phone support.",
  },
  {
    id: "10",
    question: "Can users outside Nigeria use the platform?",
    answer:
      "Yes, international users can access and use the platform where supported.",
  },
];

const FAQ = () => {
  const [active, setActive] = useState(null);

  const toggleFAQ = (index) => {
    setActive(active === index ? null : index);
  };

  return (
    <section className="faq-section">
      <h1 className="faq-title">FAQ</h1>

      <p className="faq-subtitle">
        Get answers to frequently asked questions about discovering attractions,
        booking tickets, payments, and using your digital tickets on Novaxcape.
      </p>

      <div className="faq-container">
        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <span className="faq-number">{item.id}</span>

              <span className="question-text">{item.question}</span>

              <span className="faq-icon">
                {active === index ? <FaMinus /> : <FaPlus />}
              </span>
            </div>

            {active === index && (
              <div className="faq-answer">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
