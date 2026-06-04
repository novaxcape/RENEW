import React from "react";
import "../components/css/Supportpagesubherocontext.css";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const contactData = [
  {
    id: 1,
    icon: <FaEnvelope />,
    title: "Live Chat",
    text: "Available 9AM-6PM WAT",
    button: "Start Chat",
    cardClass: "blue-card",
    iconBg: "blue-icon",
    btnClass: "blue-btn",
  },
  {
    id: 2,
    icon: <FaPhoneAlt />,
    title: "Phone Support",
    text: "+234 706 941 359",
    button: "Call Now",
    cardClass: "orange-card",
    iconBg: "orange-icon",
    btnClass: "orange-btn",
  },
  {
    id: 3,
    icon: <FaEnvelope />,
    title: "Email Support",
    text: "Support@novaxcape.ng",
    button: "Send Email",
    cardClass: "blue-card",
    iconBg: "blue-icon",
    btnClass: "blue-btn",
  },
];

const ContactSection = () => {
  return (
    <section className="contact-section">
      <div className="contact-header">
        <h1>We're always here to help.</h1>
        <p>
          Reach out to us through any of our support channels
          <br />
          and our team will respond promptly to ensure you
          <br />
          have a smooth experience.
        </p>
      </div>

      <div className="contact-cards">
        {contactData.map((item) => (
          <div key={item.id} className={`contact-card ${item.cardClass}`}>
            <div className={`icon-circle ${item.iconBg}`}>{item.icon}</div>

            <h2>{item.title}</h2>
            <p>{item.text}</p>

            <button className={item.btnClass}>{item.button}</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContactSection;
