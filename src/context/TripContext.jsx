import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const allTrips = JSON.parse(localStorage.getItem('trips')) || {};
      const userTrips = allTrips[currentUser.id] || [];
      setTrips(userTrips);
    } else {
      setTrips([]);
    }
  }, [currentUser]);

  const saveTripsToStorage = (updatedTrips) => {
    if (currentUser) {
      const allTrips = JSON.parse(localStorage.getItem('trips')) || {};
      allTrips[currentUser.id] = updatedTrips;
      localStorage.setItem('trips', JSON.stringify(allTrips));
    }
  };

  const addTrip = (trip) => {
    const newTrip = {
      ...trip,
      id: Date.now().toString(),
      expenses: [],
      createdAt: new Date().toISOString()
    };
    const updatedTrips = [...trips, newTrip];
    setTrips(updatedTrips);
    saveTripsToStorage(updatedTrips);
    return newTrip.id;
  };

  const getTripById = (id) => {
    return trips.find(t => t.id === id);
  };

  const addExpense = (tripId, expense) => {
    const updatedTrips = trips.map(trip => {
      if (trip.id === tripId) {
        return {
          ...trip,
          expenses: [...trip.expenses, { ...expense, id: Date.now().toString(), date: new Date().toISOString() }]
        };
      }
      return trip;
    });
    setTrips(updatedTrips);
    saveTripsToStorage(updatedTrips);
  };

  const deleteExpense = (tripId, expenseId) => {
    const updatedTrips = trips.map(trip => {
      if (trip.id === tripId) {
        return {
          ...trip,
          expenses: trip.expenses.filter(e => e.id !== expenseId)
        };
      }
      return trip;
    });
    setTrips(updatedTrips);
    saveTripsToStorage(updatedTrips);
  };

  const deleteTrip = (tripId) => {
    const updatedTrips = trips.filter(t => t.id !== tripId);
    setTrips(updatedTrips);
    saveTripsToStorage(updatedTrips);
  };

  const value = {
    trips,
    addTrip,
    getTripById,
    addExpense,
    deleteExpense,
    deleteTrip
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};
