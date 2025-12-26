import "../styles/Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
function Home() {
  return (
    <>
      <Navbar/>
      {/* HERO SECTION */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <h1>Intelligent Parking, Simplified Management</h1>
          <p>
            Revolutionize the way you manage your parking spaces with
            ParkEase's automated, real-time system.
          </p>
          <a href="#features" className="btn btn-primary">Discover Solutions</a>
          <a href="/register" className="btn btn-secondary">Get Started Free</a>
        </div>
      </section>

      {/* WHY US */}
      <section id="why-us" className="content-section why-us">
        <h2>✅ Why Choose ParkEase?</h2>
        <div className="why-us-grid">
          <div className="reason-card">
            <h3>Maximize Revenue</h3>
            <p>Optimize space utilization and dynamic pricing to boost profitability.</p>
          </div>
          <div className="reason-card">
            <h3>Real-Time Analytics</h3>
            <p>Instant insights into occupancy and user behavior.</p>
          </div>
          <div className="reason-card">
            <h3>Seamless Experience</h3>
            <p>Mobile booking, ticketless entry, and fast payments.</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="content-section features">
        <h2>✨ Core Features</h2>
        <div className="feature-grid">
          <div className="feature-item">
            <h3>Automated Entry/Exit</h3>
            <p>License Plate Recognition for fast access.</p>
          </div>
          <div className="feature-item">
            <h3>Mobile Booking</h3>
            <p>Find and book parking from your phone.</p>
          </div>
          <div className="feature-item">
            <h3>Centralized Control</h3>
            <p>Manage all parking locations from one dashboard.</p>
          </div>
          <div className="feature-item">
            <h3>Occupancy Monitoring</h3>
            <p>Live availability updates.</p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="content-section pricing">
        <h2>💰 Simple Pricing</h2>
        <div className="pricing-grid">
          <div className="plan-card">
            <h3>Basic</h3>
            <p className="price">₹49<span>/month</span></p>
            <ul>
              <li>Single Location</li>
              <li>Email Support</li>
            </ul>
          </div>

          <div className="plan-card featured">
            <h3>Pro</h3>
            <p className="price">₹99<span>/month</span></p>
            <ul>
              <li>Multi-Location</li>
              <li>Advanced Analytics</li>
            </ul>
          </div>

          <div className="plan-card">
            <h3>Enterprise</h3>
            <p className="price">Custom</p>
            <ul>
              <li>Unlimited Locations</li>
              <li>Custom Integrations</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="cta-section">
        <h2>Ready to Upgrade Your Parking?</h2>
        <p>Start your free trial today.</p>
        <a href="/register" className="btn btn-primary large">
          Start Free Trial
        </a>
      </section>
      <Footer/>
    </>
  );
}

export default Home;
