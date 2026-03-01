import React, { useState, useEffect } from 'react';
import { getTransactions, getCategories, postTransaction, deleteTransaction } from './api/transactionApi';
import { TransactionTable } from './components/TransactionTable';
import { TransactionForm } from './components/TransactionForm';
import Modal from '../../components/Modal'; // Import the global reusable modal
import styles from './Transactions.module.css';
import SettingsPage from '../settings/SettingsPage'; // Adjust path as needed

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('Actual'); 
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [viewMode, setViewMode] = useState('combined');
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' or 'settings'

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

  // --- DATA FILTERING FOR SPLIT VIEW ---
  const incomeTransactions = transactions.filter(t => t.amount > 0);
  const expenseTransactions = transactions.filter(t => t.amount < 0);

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
      {/* 1. DYNAMIC HEADER */}
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>
            {activeTab === 'transactions' ? 'Transactions' : 'Budget Settings'}
          </h2>
          <p className={styles.subtitle}>
            {activeTab === 'transactions' 
              ? 'Track and plan your budget' 
              : 'Configure your monthly goals and categories'}
          </p>
          
          <div className={styles.viewActions}>
            {/* Toggle between Transactions and Settings */}
            <button 
              className={styles.settingsBtn}
              onClick={() => setActiveTab(activeTab === 'transactions' ? 'settings' : 'transactions')}
            >
              {activeTab === 'transactions' ? '⚙️ Budget Settings' : '⬅️ Back to Transactions'}
            </button>

            {/* Only show Split/Combined toggle on the Transaction list */}
            {activeTab === 'transactions' && (
              <button 
                className={styles.viewToggleBtn} 
                onClick={() => setViewMode(viewMode === 'combined' ? 'split' : 'combined')}
              >
                {viewMode === 'combined' ? '📊 Split View' : '📋 Combined View'}
              </button>
            )}
          </div>
        </div>
        
        {/* Only show "Add" buttons if we are on the transactions tab */}
        {activeTab === 'transactions' && (
          <div className={styles.buttonGroup}>
            <button className={styles.secondaryBtn} onClick={() => handleOpenModal('Planned')}>+ Add Planned</button>
            <button className={styles.primaryBtn} onClick={() => handleOpenModal('Actual')}>+ Add Actual</button>
          </div>
        )}
      </header>

      {/* 2. TOAST NOTIFICATIONS */}
      {toast.show && (
        <div className={styles.toast}>
          <span className={styles.toastIcon}>{toast.type === 'income' ? '💰' : '📉'}</span>
          {toast.message}
        </div>
      )}

      {/* 3. MODAL FOR ADDING TRANSACTIONS */}
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

      {/* 4. MAIN CONTENT AREA (The Swap) */}
      <main className={styles.mainContent}>
        {activeTab === 'transactions' ? (
          /* --- TRANSACTION VIEW (Combined or Split) --- */
          <div className={viewMode === 'split' ? styles.splitGrid : styles.tableWrapper}>
            {viewMode === 'combined' ? (
              <TransactionTable 
                transactions={transactions} 
                categories={categories} 
                onDelete={handleDelete} 
              />
            ) : (
              <>
                <div className={styles.splitColumn}>
                  <h3 className={styles.incomeHeader}>Income</h3>
                  <TransactionTable 
                    transactions={incomeTransactions} 
                    categories={categories} 
                    onDelete={handleDelete} 
                  />
                </div>
                <div className={styles.splitColumn}>
                  <h3 className={styles.expenseHeader}>Expenses</h3>
                  <TransactionTable 
                    transactions={expenseTransactions} 
                    categories={categories} 
                    onDelete={handleDelete} 
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          /* --- SETTINGS VIEW --- */
          <div className={styles.settingsWrapper}>
            {/* Dropping the official SettingsPage here */}
            <SettingsPage />
          </div>
        )}
      </main>
    </div>
  );
}