// import "./home.css";
import "./css/Heroes.css"
// import "./home.css";

export default function Home() {
  const attractions = [
    {
      name: "Lekki Conservation Centre",
      location: "Lagos",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
      rating: "5.0",
    },
    {
      name: "Yankari National Park",
      location: "Bauchi",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      rating: "4.0",
    },
    {
      name: "Olumo Rock",
      location: "Abeokuta",
      image:
        "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80",
      rating: "5.0",
    },
    {
      name: "Obudu Mountain Resort",
      location: "Cross River",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      rating: "4.5",
    },
    {
      name: "Green Legacy Resort",
      location: "Abeokuta",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      rating: "4.0",
    },
    {
      name: "Omu Resort",
      location: "Lagos",
      image:
        "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
      rating: "5.0",
    },
  ];

  return (
    <div className="page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <span className="tag">✈ Explore Nigeria's hidden gems</span>

          <h1>
            Explore Nigeria's Most
            <span> Stunning Places</span>
          </h1>

          <p>
            Discover beautiful tourism centres across Nigeria, book tickets
            instantly and create memories that matter.
          </p>

          <div className="search">
            <input placeholder="Where to?" />
            <input placeholder="When?" />
            <button>Search</button>
          </div>
        </div>

        <div className="hero-gallery">
          <div className="image img1">
            <img
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80"
              alt=""
            />
          </div>

          <div className="image img2">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
              alt=""
            />
          </div>

          <div className="image img3">
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
              alt=""
            />
          </div>

          <div className="image img4">
            <img
              src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80"
              alt=""
            />
          </div>

          <div className="floating-card">
            <h3>100+</h3>
            <span>Destinations</span>
            <p>More than 100 travellers use this platform.</p>
          </div>
        </div>
      </section>

      {/* RECOMMENDATION */}
      <section className="recommend">
        <div className="cluster">
          <img
            className="one"
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
            alt=""
          />

          <img
            className="two"
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
            alt=""
          />

          <img
            className="three"
            src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80"
            alt=""
          />
        </div>

        <div className="recommend-content">
          <span className="section-tag">What We Recommend</span>

          <h2>
            We Recommend Beautiful Destinations Every Month
          </h2>

          <p>
            Let's choose your dream destination and enjoy the best tourism
            experience.
          </p>

          <div className="stats">
            <div>
              <h3>2000+</h3>
              <p>Our Explorers</p>
            </div>

            <div>
              <h3>100+</h3>
              <p>Destinations</p>
            </div>

            <div>
              <h3>20+</h3>
              <p>Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* ATTRACTIONS */}
      <section className="attractions">
        <h2>Top Attractions</h2>

        <p className="subtitle">
          Most visited and highly rated tourism centres
        </p>

        <div className="attractions-grid">
          {attractions.map((item) => (
            <div className="card" key={item.name}>
              <div className="card-image">
                <img src={item.image} alt={item.name} />
                <span className="badge">Trending</span>
              </div>

              <div className="card-body">
                <h3>{item.name}</h3>
                <p>{item.location}</p>

                <div className="rating">
                  ⭐ {item.rating}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}