import React, { useState } from 'react';
import styles from './TransactionForm.module.css';

export const TransactionForm = ({ categories, onSave, type }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Defaults to today
    amount: '',
    description: '',
    category_id: '',
    type: 'Expense' // Default type
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Professional touch: convert amount to number and apply sign based on type
    const finalAmount = formData.type === 'Expense' 
      ? -Math.abs(parseFloat(formData.amount)) 
      : Math.abs(parseFloat(formData.amount));

    onSave({ ...formData, amount: finalAmount });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* 1. Income/Expense Toggle */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Transaction Type</label>
        <div className={styles.typeToggle}>
          {['Expense', 'Income'].map((t) => (
            <button
              key={t}
              type="button"
              className={`${styles.toggleBtn} ${formData.type === t ? styles.toggleBtnActive : ''}`}
              onClick={() => setFormData({ ...formData, type: t })}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Amount & Date */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Amount</label>
        <input 
          type="number" 
          required 
          className={styles.input}
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Date</label>
        <input 
          type="date" 
          required 
          className={styles.input}
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>

      {/* 3. Category Dropdown */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Category</label>
        <select 
          required 
          className={styles.select}
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* 4. Description */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Description</label>
        <input 
          type="text" 
          className={styles.input}
          placeholder="What was this for?"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <button type="submit" className={styles.saveBtn}>
        Save {type} Transaction
      </button>
    </form>
  );
};