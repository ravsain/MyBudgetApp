import React, { useState, useEffect } from 'react'; // Added useEffect
import styles from './Settings.module.css';

// Added initialData to the destructuring
export const BudgetPeriodForm = ({ onSave, onOpenPlanning, hasActivePeriod, initialData }) => {
  const [formData, setFormData] = useState({
    month_year: '',
    starting_balance: 0,
    start_date: '',
    end_date: ''
  });

  // 1. THE WATCHER: Populates the form when editing or clears it when 'Start New' is clicked
  useEffect(() => {
    if (initialData) {
      setFormData({
        month_year: initialData.month_year || '',
        starting_balance: initialData.starting_balance || 0,
        start_date: initialData.start_date || '',
        end_date: initialData.end_date || ''
      });
    } else {
      // Reset to empty for "Start New Month"
      setFormData({
        month_year: '',
        starting_balance: 0,
        start_date: '',
        end_date: ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === 'starting_balance' ? parseFloat(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={styles.card}>
      {/* 2. DYNAMIC TITLE: Changes based on mode */}
      <h3>{initialData ? "Edit Budget Setup" : "Monthly Budget Setup"}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Starting Balance (₹)</label>
            <input 
              name="starting_balance"
              type="number" 
              placeholder="50000" 
              className={styles.input}
              value={formData.starting_balance} // 3. CONTROLLED INPUT
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Month & Year</label>
            <input 
              name="month_year"
              type="month" 
              className={styles.input}
              value={formData.month_year} // 3. CONTROLLED INPUT
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Start Date</label>
            <input 
              name="start_date"
              type="date" 
              className={styles.input}
              value={formData.start_date} // 3. CONTROLLED INPUT
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>End Date</label>
            <input 
              name="end_date"
              type="date" 
              className={styles.input}
              value={formData.end_date} // 3. CONTROLLED INPUT
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.buttonRow}>
          <button type="submit" className={styles.saveBtn}>
            {/* 4. DYNAMIC BUTTON TEXT */}
            {initialData ? "Update Setup" : "Initialize Month"}
          </button>
          
          <button 
            type="button" 
            className={styles.planBtn} 
            onClick={onOpenPlanning}
            disabled={!hasActivePeriod}
            title={!hasActivePeriod ? "Initialize the month first" : ""}
          >
            📊 Set Planned Budget
          </button>
        </div>
      </form>
    </div>
  );
};