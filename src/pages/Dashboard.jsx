import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { TripContext } from '../context/TripContext';
import { AuthContext } from '../context/AuthContext';
import { FaPlusCircle, FaPlane, FaTrash } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const { trips, addTrip, deleteTrip } = useContext(TripContext);
  const { currentUser } = useContext(AuthContext);
  
  const [showModal, setShowModal] = useState(false);
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('USD');

  const handleAddTrip = (e) => {
    e.preventDefault();
    if (!destination || !budget) return;

    addTrip({
      destination,
      budget: parseFloat(budget),
      currency
    });

    setDestination('');
    setBudget('');
    setShowModal(false);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="welcome-text">Welcome, {currentUser?.name}</h1>
          <p className="subtitle">Here is an overview of your trips and budget.</p>
        </div>
        <button className="btn-add-trip" onClick={() => setShowModal(true)}>
          <FaPlusCircle size={20} />
          Add New Trip
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="empty-state">
          <FaPlane size={48} className="empty-icon" />
          <h3>No trips yet</h3>
          <p>Start planning your next trip and easily control your budget.</p>
          <button className="btn-add-trip mt-4" onClick={() => setShowModal(true)}>
            Add your first trip
          </button>
        </div>
      ) : (
        <div className="trips-grid">
          {trips.map(trip => {
            const totalSpent = trip.expenses.reduce((sum, exp) => sum + parseFloat(exp.convertedAmount || exp.amount), 0);
            const remaining = trip.budget - totalSpent;
            const progress = Math.min((totalSpent / trip.budget) * 100, 100);
            
            return (
              <div key={trip.id} className="trip-card">
                <div className="trip-card-header">
                  <h3>{trip.destination}</h3>
                  <button onClick={() => deleteTrip(trip.id)} className="btn-delete" title="Delete Trip">
                    <FaTrash size={18} />
                  </button>
                </div>
                
                <div className="trip-budget-info">
                  <div className="budget-item">
                    <span>Budget:</span>
                    <strong>{trip.budget} {trip.currency}</strong>
                  </div>
                  <div className="budget-item">
                    <span>Spent:</span>
                    <strong className="text-danger">{totalSpent.toFixed(2)} {trip.currency}</strong>
                  </div>
                  <div className="budget-item">
                    <span>Remaining:</span>
                    <strong className={remaining < 0 ? 'text-danger' : 'text-success'}>
                      {remaining.toFixed(2)} {trip.currency}
                    </strong>
                  </div>
                </div>

                <div className="progress-container">
                  <div 
                    className={`progress-bar ${progress > 90 ? 'danger' : progress > 75 ? 'warning' : 'success'}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <Link to={`/trip/${trip.id}`} className="btn-view-trip">
                  View Details & Expenses
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Trip Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Trip</h2>
            <form onSubmit={handleAddTrip}>
              <div className="form-group">
                <label>Destination (City or Country)</label>
                <input 
                  type="text" 
                  value={destination} 
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g., Dubai, London, Paris..."
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Budget</label>
                <input 
                  type="number" 
                  value={budget} 
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="5000"
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Base Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="SAR">Saudi Riyal (SAR)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="AED">UAE Dirham (AED)</option>
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-save">Save Trip</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
