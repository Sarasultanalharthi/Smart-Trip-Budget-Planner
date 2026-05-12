import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaPlaneDeparture, FaChartPie, FaExchangeAlt } from 'react-icons/fa';
import heroImg from '../assets/hero.png';
import './Landing.css';

const Landing = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="landing-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Plan Your Next Adventure Smarter</h1>
          <p>Track your expenses, analyze your spending, and stay on budget no matter where your travels take you.</p>
          <div className="hero-actions">
            {currentUser ? (
              <Link to="/dashboard" className="btn-primary hero-btn">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary hero-btn">Get Started</Link>
                <Link to="/login" className="btn-outline hero-btn">Log In</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImg} alt="Travel Illustration" />
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon"><FaPlaneDeparture /></div>
          <h3>Multiple Trips</h3>
          <p>Organize budgets for different destinations easily.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><FaExchangeAlt /></div>
          <h3>Currency Conversion</h3>
          <p>Automatic live conversion for foreign expenses.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><FaChartPie /></div>
          <h3>Visual Analytics</h3>
          <p>See exactly where your money goes with charts.</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
