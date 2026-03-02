import React, { useState } from 'react';
import styles from './Settings.module.css';

export const CategoryManager = ({ categories, onAddCategory, onDeleteCategory }) => {
  const [newName, setNewName] = useState('');
  const [type, setType] = useState('Expense');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    // Sends both name and type to SettingsPage.jsx
    onAddCategory(newName, type); 
    setNewName('');
  };

  return (
    <div className={styles.card}>
      <h3>Manage Categories</h3>
      
      <form onSubmit={handleSubmit} className={styles.modernForm}>
        {/* iOS-Friendly Segmented Toggle */}
        <div className={styles.toggleGroup}>
          <button 
            type="button" 
            className={`${styles.toggleBtn} ${type === 'Expense' ? styles.activeToggle : ''}`}
            onClick={() => setType('Expense')}
          >
            Expense
          </button>
          <button 
            type="button" 
            className={`${styles.toggleBtn} ${type === 'Income' ? styles.activeToggle : ''}`}
            onClick={() => setType('Income')}
          >
            Income
          </button>
        </div>

        <div className={styles.inputGroup}>
          <input 
            type="text" 
            className={styles.modernInput}
            placeholder="e.g. Rent, Salary, Food"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <button type="submit" className={styles.addBtn}>Add</button>
        </div>
      </form>

      <div className={styles.categoryList}>
        {categories.map(cat => (
          <div key={cat.id} className={styles.chip}>
            <span>{cat.name}</span>
            <span className={styles.chipType}>{cat.type}</span>
            {/* The Delete "X" Button */}
            <button 
              type="button"
              className={styles.deleteChipBtn}
              onClick={() => onDeleteCategory(cat.id)}
              aria-label="Delete category"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};