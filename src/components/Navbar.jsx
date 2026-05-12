import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaSignOutAlt, FaUser, FaWallet, FaHome, FaTachometerAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo - always goes to Home */}
        <Link to="/" className="nav-logo">
          <FaWallet className="icon-logo" />
          <span>TripBudget</span>
        </Link>

        <div className="nav-links">
          {currentUser ? (
            <>
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                <FaHome size={16} />
                Home
              </Link>
              <Link
                to="/dashboard"
                className={`nav-link ${location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/trip') ? 'active' : ''}`}
              >
                <FaTachometerAlt size={16} />
                Dashboard
              </Link>
              <span className="nav-divider" />
              <span className="nav-user">
                <FaUser size={14} />
                {currentUser.name}
              </span>
              <button onClick={handleLogout} className="btn-logout">
                <FaSignOutAlt size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                <FaHome size={16} />
                Home
              </Link>
              <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>Login</Link>
              <Link to="/register" className="btn-register-nav">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
