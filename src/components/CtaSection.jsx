import "./css/CtaSection.css";
import { useNavigate } from "react-router-dom";


const CtaSection = () => {
    const navigate = useNavigate();

  return (
    <section className="cta-section">
      <div className="cta-card">
        <div className="cta-circle cta-circle--top-left">
          <div className="cta-circle__inner"></div>
        </div>

        <div className="cta-circle cta-circle--bottom-right">
          <div className="cta-circle__inner"></div>
        </div>

        <div className="cta-content">
          <span className="cta-badge">Start Your Adventure today</span>
          <h2 className="cta-heading">Ready to Explore Nigeria's Best Attractions?</h2>
          <p className="cta-paragraph">
            Join thousands of travelers discovering amazing experiences across Nigeria. Book your tickets now and enjoy stress-free tourism!
          </p>
          <button className="cta-button"
                      onClick={() => navigate("/discover")}
>Browse Attractions</button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;