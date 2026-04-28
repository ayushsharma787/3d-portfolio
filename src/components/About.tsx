import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">The Thesis</h3>
        <p className="para">
          Bengaluru, 2020. A founder sits with a choice: go deeper into India's
          agri-finance fabric, or go global with the satellite products. On paper
          Satyukt looks like four products — Sat2Farm, Sat2Credit, Sat4Agri,
          Sat4Risk — built on free ISRO and Sentinel pixels. Look closer and the
          real argument writes itself: ~60% of Indians depend on agriculture for a
          ~15% slice of GDP, and roughly half of small and marginal farmers cannot
          borrow from any formal source. Satyukt is not here to grow more rice.
          It is here to make farmers legible to capital. This is not a satellite
          company. It is trust infrastructure for agri-finance.
        </p>
      </div>
    </div>
  );
};

export default About;
