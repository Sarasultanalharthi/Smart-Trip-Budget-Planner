import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { TripContext } from '../context/TripContext';
import { FaArrowLeft, FaPlusCircle, FaTrash } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './TripDetails.css';

const CATEGORIES = [
  { id: 'accommodation', label: 'Accommodation', color: '#3498db' },
  { id: 'food', label: 'Food & Drinks', color: '#e74c3c' },
  { id: 'transport', label: 'Transport', color: '#f1c40f' },
  { id: 'entertainment', label: 'Entertainment', color: '#9b59b6' },
  { id: 'other', label: 'Other', color: '#95a5a6' }
];

const CURRENCIES = ['USD', 'SAR', 'EUR', 'GBP', 'AED', 'KWD', 'BHD', 'EGP'];

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTripById, addExpense, deleteExpense } = useContext(TripContext);
  
  const trip = getTripById(id);

  const [showModal, setShowModal] = useState(false);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [currency, setCurrency] = useState(trip?.currency || 'USD');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (!trip) {
      navigate('/dashboard');
    }
  }, [trip, navigate]);

  if (!trip) return null;

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!desc || !amount) return;

    setLoading(true);
    setApiError('');
    let finalAmount = parseFloat(amount);
    let conversionRate = 1;

    if (currency !== trip.currency) {
      try {
        const response = await fetch(`https://open.er-api.com/v6/latest/${currency}`);
        const data = await response.json();
        
        if (data.result === 'success') {
          conversionRate = data.rates[trip.currency];
          finalAmount = finalAmount * conversionRate;
        } else {
          throw new Error('Failed to fetch exchange rate');
        }
      } catch (err) {
        setApiError('Error converting currency. Please check your internet connection.');
        setLoading(false);
        return;
      }
    }

    addExpense(trip.id, {
      description: desc,
      amount: parseFloat(amount),
      originalCurrency: currency,
      convertedAmount: finalAmount,
      conversionRate,
      category
    });

    setDesc('');
    setAmount('');
    setCategory(CATEGORIES[0].id);
    setCurrency(trip.currency);
    setShowModal(false);
    setLoading(false);
  };

  const totalSpent = trip.expenses.reduce((sum, exp) => sum + parseFloat(exp.convertedAmount || exp.amount), 0);
  const remaining = trip.budget - totalSpent;

  const chartData = CATEGORIES.map(cat => {
    const value = trip.expenses
      .filter(exp => exp.category === cat.id)
      .reduce((sum, exp) => sum + parseFloat(exp.convertedAmount || exp.amount), 0);
    return { name: cat.label, value, color: cat.color };
  }).filter(data => data.value > 0);

  return (
    <div className="trip-details-container">
      <Link to="/dashboard" className="btn-back">
        <FaArrowLeft size={20} />
        Back to Dashboard
      </Link>

      <div className="trip-header">
        <div className="trip-title-section">
          <h1>{trip.destination}</h1>
          <p>Add your expenses and smartly monitor your budget</p>
        </div>
        <button className="btn-add-expense" onClick={() => setShowModal(true)}>
          <FaPlusCircle size={20} />
          Add Expense
        </button>
      </div>

      <div className="dashboard-metrics">
        <div className="metric-card">
          <h3>Total Budget</h3>
          <p className="metric-value">{trip.budget} {trip.currency}</p>
        </div>
        <div className="metric-card">
          <h3>Total Spent</h3>
          <p className="metric-value text-danger">{totalSpent.toFixed(2)} {trip.currency}</p>
        </div>
        <div className="metric-card">
          <h3>Remaining Balance</h3>
          <p className={`metric-value ${remaining < 0 ? 'text-danger' : 'text-success'}`}>
            {remaining.toFixed(2)} {trip.currency}
          </p>
        </div>
      </div>

      <div className="details-content">
        <div className="expenses-list-container">
          <h2>Expenses Log</h2>
          {trip.expenses.length === 0 ? (
            <div className="empty-expenses">
              <p>You haven't added any expenses yet.</p>
            </div>
          ) : (
            <div className="expenses-list">
              {trip.expenses.map(exp => {
                const catInfo = CATEGORIES.find(c => c.id === exp.category);
                return (
                  <div key={exp.id} className="expense-item">
                    <div className="expense-info">
                      <div className="expense-icon" style={{ backgroundColor: catInfo?.color }}></div>
                      <div>
                        <h4>{exp.description}</h4>
                        <span className="expense-category">{catInfo?.label}</span>
                      </div>
                    </div>
                    <div className="expense-amount-section">
                      <div className="expense-amounts">
                        <span className="primary-amount text-danger">
                          -{exp.convertedAmount?.toFixed(2) || exp.amount} {trip.currency}
                        </span>
                        {exp.originalCurrency !== trip.currency && (
                          <span className="secondary-amount">
                            ({exp.amount} {exp.originalCurrency})
                          </span>
                        )}
                      </div>
                      <button onClick={() => deleteExpense(trip.id, exp.id)} className="btn-delete" title="Delete">
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="chart-container">
          <h2>Expense Analysis</h2>
          {chartData.length === 0 ? (
            <div className="empty-chart">Add expenses to see the chart</div>
          ) : (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(2)} ${trip.currency}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Expense</h2>
            {apiError && <div className="auth-error">{apiError}</div>}
            
            <form onSubmit={handleAddExpense}>
              <div className="form-group">
                <label>Description</label>
                <input 
                  type="text" 
                  value={desc} 
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="e.g., Dinner, Train ticket..."
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Amount</label>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="100"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    {CURRENCIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {currency !== trip.currency && (
                <div className="conversion-note">
                  This amount will be automatically converted to <strong>{trip.currency}</strong> based on live exchange rates.
                </div>
              )}

              <div className="form-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetails;
