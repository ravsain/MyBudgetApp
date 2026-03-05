import React, { useState, useEffect } from 'react';
import { getTransactions, getCategories, postTransaction, deleteTransaction } from './api/transactionApi';
import { TransactionTable } from './components/TransactionTable';
import { TransactionForm } from './components/TransactionForm';
import api from '../../services/api';
import Modal from '../../components/Modal'; // Import the global reusable modal
import styles from './Transactions.module.css';
import SettingsPage from '../settings/SettingsPage'; // Adjust path as needed

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activePeriod, setActivePeriod] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('Actual'); 
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [viewMode, setViewMode] = useState('combined');
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' or 'settings'
  

  const loadData = async () => {
    try {
      // 1. First, get the categories and the latest active period
      const [cRes, pRes] = await Promise.all([
        getCategories(),
        api.get('/budget-periods/latest') // Assuming you have this endpoint
      ]);
      
      setCategories(cRes.data);
      const currentPeriod = pRes.data;
      setActivePeriod(currentPeriod);

      // 2. Now fetch transactions specifically for THIS period
      if (currentPeriod?.id) {
        const tRes = await api.get(`/transactions/transactions/${currentPeriod.id}`);
        setTransactions(tRes.data);
      } else {
        // If no period exists, maybe show all or nothing
        setTransactions([]);
      }
    } catch (error) {
      console.error("Failed to load data", error);
    }
  };

  useEffect(() => { loadData(); }, []);

  // --- DATA FILTERING FOR SPLIT VIEW ---
  const incomeTransactions = transactions.filter(t => t.amount > 0);
  const expenseTransactions = transactions.filter(t => t.amount < 0);


  const handleOpenModal = async () => {
    // Always set to Actual since Planned is moving to Settings
    setModalType('Actual'); 
    
    // Refresh data so new categories appear immediately
    await loadData(); 
    
    setIsModalOpen(true);
  };

  const handleSave = async (newData) => {
    // console.log("Active period:", activePeriod);  // ← DEBUG!
    // console.log("Period ID:", activePeriod?.id);  // ← CRITICAL!
    if (!activePeriod) {
      alert("Please initialize a budget month in Settings first!");
      return;
    }

    try {
      const payload = { 
        ...newData, 
        is_planned: false,
        budget_period_id: activePeriod.id // THE SOLID LINK
      };
      
      await postTransaction(payload);
      setIsModalOpen(false); 
      await loadData(); 
      showToast("Transaction added!", newData.amount > 0 ? 'income' : 'expense');
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this transaction?")) {
      try {
        await deleteTransaction(id);
        await loadData();
        showToast("Deleted successfully", "expense");
      } catch (error) {
        console.error("Delete error:", error);
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
            {/* <button className={styles.secondaryBtn} onClick={() => handleOpenModal('Planned')}>+ Add Planned</button> */}
            <button className={styles.primaryBtn} onClick={() => handleOpenModal('Actual')}>💸 New Log</button>
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
        title="Add New Transaction" 
      >
        <TransactionForm 
          categories={categories} 
          onSave={handleSave} 
          type="Actual" 
          currentPeriodId={activePeriod?.id}
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
            {/* PASS THE REFRESH FUNCTION HERE.
                When SettingsPage updates the month, it calls loadData() 
                to ensure the Transaction list is updated too. 
            */}
            <SettingsPage onMonthChange={loadData} />
          </div>
        )}
      </main>
    </div>
  );
}