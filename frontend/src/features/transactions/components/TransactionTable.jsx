import React from 'react';
import styles from './TransactionTable.module.css';

export const TransactionTable = ({ transactions, categories, onDelete }) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Date</th>
            <th className={styles.th}>Description</th>
            <th className={styles.th}>Category</th>
            <th className={styles.th}>Amount</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              {/* Fix: Using t.date instead of a new Date() */}
              <td className={styles.td}>{t.date}</td>
              
              {/* Fix: Using t.description to match our Form */}
              <td className={styles.td}>{t.description || t.name}</td>
              
              <td className={styles.td}>
                <span style={{ backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>
                  {categories.find(c => c.id === t.category_id)?.name || 'General'}
                </span>
              </td>
              
              <td className={`${styles.td} styles.amount`} 
                  style={{ color: t.amount < 0 ? '#dc3545' : '#28a745' }}>
                ₹{Math.abs(t.amount).toLocaleString('en-IN')}
              </td>
              
              <td className={styles.td}>
                <button 
                  onClick={() => onDelete(t.id)}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};