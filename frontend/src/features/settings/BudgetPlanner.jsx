import React, { useState } from 'react';
import styles from './Settings.module.css';

// 1. Add existingPlans to the props list (default to empty array to prevent crashes)
export const BudgetPlanner = ({ categories, budgetPeriod, onSavePlan, existingPlans = [] }) => {
  
  // 2. Initialize state safely
  const [plannedValues, setPlannedValues] = useState(() => {
    const initial = {};
    // Ensure we only loop if existingPlans is actually an array
    if (Array.isArray(existingPlans)) {
      existingPlans.forEach(p => {
        initial[p.category_id] = p.planned_amount;
      });
    }
    return initial;
  });

  const handleChange = (catId, value) => {
    setPlannedValues(prev => ({
      ...prev,
      [catId]: value
    }));
  };

  const handleConfirm = () => {
    // Check if budgetPeriod exists before trying to access .id
    if (!budgetPeriod) {
      alert("No active budget period found!");
      return;
    }

    const planData = categories.map(cat => ({
      category_id: cat.id,
      budget_period_id: budgetPeriod.id,
      month_year: budgetPeriod.month_year,
      planned_amount: parseFloat(plannedValues[cat.id] || 0)
    }));
    
    onSavePlan(planData);
  };

  return (
    <div className={styles.plannerContainer}>
      <table className={styles.plannerTable}>
        <thead>
          <tr>
            <th>Category</th>
            <th>Type</th>
            <th>Planned Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>
                <span className={cat.type === 'Income' ? styles.incomeTag : styles.expenseTag}>
                  {cat.type}
                </span>
              </td>
              <td>
                <input 
                  type="number" 
                  className={styles.modernInput}
                  placeholder="0.00"
                  value={plannedValues[cat.id] || ''}
                  onChange={(e) => handleChange(cat.id, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.saveBtn} onClick={handleConfirm}>
        Save Budget Plan
      </button>
    </div>
  );
};