import "./css/HowItWorks.css";

const HowItWorks = () => {
  return (
    <section className="how">
      <div className="how__header">
        <div className="how__left">
          <p className="how__eyebrow">How it Works</p>
          <h2 className="how__heading">
            We have the best team and the best process
          </h2>
          <p className="how__paragraph">
            Dedicated to making your tourism experiences seamless and
            enjoyable, we've built a simple and reliable platform that lets
            you discover great places, book tickets instantly, and enjoy
            stress-free visits across Nigeria.
          </p>
          <button className="how__button">Get Started</button>
        </div>
        <div className="how__right"></div>
      </div>

      <div className="how__image-wrapper">
        <img
          src="/novaxcape/how.png"
          alt="howitworks"
          className="how__image"
        />
      </div>
    </section>
  );
};

export default HowItWorks;