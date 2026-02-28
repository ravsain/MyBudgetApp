import React, { useState, useEffect } from 'react';
import { getTransactions, getCategories, postTransaction, deleteTransaction } from './api/transactionApi';
import { TransactionTable } from './components/TransactionTable';
import { TransactionForm } from './components/TransactionForm';
import Modal from '../../components/Modal'; // Import the global reusable modal
import styles from './Transactions.module.css';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('Actual'); 
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const loadData = async () => {
    try {
      const [tRes, cRes] = await Promise.all([getTransactions(), getCategories()]);
      setTransactions(tRes.data);
      setCategories(cRes.data);
    } catch (error) {
      console.error("Failed to load data", error);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSave = async (newData) => {
    try {
      await postTransaction({ ...newData, is_planned: modalType === 'Planned' });
      setIsModalOpen(false); 
      loadData(); 
      showToast(`${modalType} Transaction added!`, newData.amount > 0 ? 'income' : 'expense');
    } catch (error) {
      alert("Error saving transaction");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this transaction?")) {
      try {
        await deleteTransaction(id);
        loadData();
        showToast("Deleted successfully", "expense");
      } catch (error) {
        alert("Delete failed");
      }
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>Transactions</h2>
          <p className={styles.subtitle}>Track and plan your budget</p>
        </div>
        
        <div className={styles.buttonGroup}>
          <button className={styles.secondaryBtn} onClick={() => handleOpenModal('Planned')}>+ Add Planned</button>
          <button className={styles.primaryBtn} onClick={() => handleOpenModal('Actual')}>+ Add Actual</button>
        </div>
      </header>

      {toast.show && (
        <div className={styles.toast}>
          <span className={styles.toastIcon}>{toast.type === 'income' ? '💰' : '📉'}</span>
          {toast.message}
        </div>
      )}

      {/* Using the Global Reusable Modal instead of manual divs */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Add ${modalType} Transaction`}
      >
        <TransactionForm 
          categories={categories} 
          onSave={handleSave} 
          type={modalType} 
        />
      </Modal>

      <div className={styles.tableWrapper}>
        <TransactionTable 
          transactions={transactions} 
          categories={categories} 
          onDelete={handleDelete} 
        />
      </div>
    </div>
  );
}