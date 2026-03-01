import React, { useState } from 'react';
import styles from './Settings.module.css';

export const BudgetPeriodForm = ({ onSave }) => {
  // 1. Initialize state with keys that match your Python Schemas
  const [formData, setFormData] = useState({
    month_year: '',
    starting_balance: 0,
    start_date: '',
    end_date: ''
  });

  // 2. Handle input changes dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert balance to a number so FastAPI doesn't complain
    const finalValue = name === 'starting_balance' ? parseFloat(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  // 3. Trigger the onSave prop when the button is clicked
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={styles.card}>
      <h3>Monthly Budget Setup</h3>
      <form onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Starting Balance (₹)</label>
            <input 
              name="starting_balance"
              type="number" 
              placeholder="50000" 
              className={styles.input}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Month & Year</label>
            <input 
              name="month_year"
              type="month" 
              className={styles.input}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Start Date</label>
            <input 
              name="start_date"
              type="date" 
              className={styles.input}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>End Date</label>
            <input 
              name="end_date"
              type="date" 
              className={styles.input}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit" className={styles.saveBtn}>Initialize Month</button>
      </form>
    </div>
  );
};