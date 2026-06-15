import React from "react";
import "../components/css/Supportpagesubherocontext.css";
import { MdOutlineCall } from "react-icons/md";
import { HiOutlineEnvelope } from "react-icons/hi2";


const contactData = [
  {
    id: 1,
    icon: <HiOutlineEnvelope color="#003b9f"/>,
    title: "Live Chat",
    text: "Available 9AM-6PM WAT",
    button: "Start Chat",
    cardClass: "blue-card",
    iconBg: "blue-icon",
    btnClass: "blue-btn",
  },
  {
    id: 2,
    icon: <MdOutlineCall color="#ff6b35"/>,
    title: "Phone Support",
    text: "+234 706 941 359",
    button: "Call Now",
    cardClass: "orange-card",
    iconBg: "orange-icon",
    btnClass: "orange-btn",
  },
  {
    id: 3,
    icon: <HiOutlineEnvelope color="#003b9f"/>,
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
