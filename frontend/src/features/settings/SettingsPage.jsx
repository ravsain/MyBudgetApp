import React, { useState, useEffect } from 'react';
import styles from './Settings.module.css';
import { CategoryManager } from './CategoryManager';
import { BudgetPeriodForm } from './BudgetPeriodForm';
import api from '../../services/api';
import Modal from '../../components/Modal'; 
import { BudgetPlanner } from './BudgetPlanner';
// import { getCategories, postCategory, saveBudgetSetup } from './api/settingsApi'; 

export default function SettingsPage({ onMonthChange }) {
  const [categories, setCategories] = useState([]);
  const [budgetPeriod, setBudgetPeriod] = useState(null); 
  const [existingPlans, setExistingPlans] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);
  // 1. Fetch categories from backend on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Load Categories first so they are available for the planner
        loadCategories();
        
        const periodRes = await api.get('/budget-periods/latest');
        if (periodRes.data) {
          setBudgetPeriod(periodRes.data);
          setIsEditing(true);

          // Wrap this in its own try/catch so a 404 here doesn't crash the whole page
          try {
            const plansRes = await api.get(`/budget-plans/plans/${periodRes.data.id}`);
            setExistingPlans(plansRes.data);
          } catch (planErr) {
            console.log("No plans created for this period yet.");
            setExistingPlans([]); // Set to empty array so BudgetPlanner is happy
          }
        }
      } catch (err) {
        setIsEditing(false);
      }
    };
    loadData();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  // 2. Updated Add Category Logic
  const handleAddCategory = async (name, type) => {
    try {
      const payload = { 
        name: name, 
        type: type // Now comes from the dropdown!
      };

      const response = await api.post('/categories/', payload);
      setCategories(prev => [...prev, response.data]);
    } catch (error) {
      console.error("Error:", error.response?.data);
    }
  };
   
  const handleDeleteCategory = async (id) => {
    // Confirm before deleting (optional but recommended)
    if (!window.confirm("Delete this category?")) return;

    try {
      // 1. Tell the backend to delete it
      await api.delete(`/categories/${id}`);
      
      // 2. Update the UI state immediately by filtering it out
      setCategories(prev => prev.filter(cat => cat.id !== id));
      
      console.log(`Category ${id} deleted`);
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Make sure it's not being used by any transactions!");
    }
  };

  const handleSaveBudget = async (budgetData) => {
    try {
      let response;
      
      if (isEditing && budgetPeriod?.id) {
        // 1. UPDATE current month (Middle-of-month changes)
        response = await api.put(`/budget-periods/${budgetPeriod.id}`, budgetData);
        console.log("Updated active period:", response.data);
      } else {
        // 2. CREATE brand new month (Start New Month)
        response = await api.post('/budget-periods/', budgetData);
        setIsEditing(true); // Now we are in edit mode for this new month
      }

      setBudgetPeriod(response.data);
      // This tells the Transactions page to reload everything because 
      // // the active period might have changed or been created.
      if (onMonthChange) onMonthChange();
      alert(isEditing ? "Budget updated!" : `Budget initialized for ${response.data.month_year}!`);
      
    } catch (error) {
      const message = error.response?.data?.detail || "Save failed";
      alert("Error: " + message);
    }
  };

  const handleOpenPlanning = () => {
    // We will ensure a budget period exists before allowing planning
    if (!budgetPeriod) {
      alert("Please initialize a month first!");
      return;
    }
    setIsPlanningModalOpen(true);
  };

  const handleSaveBulkPlan = async (planData) => {
      try {
        const response = await api.post('/budget-plans/bulk', planData);
        
        // Update the local state with the returned data from backend
        setExistingPlans(response.data); 
        
        setIsPlanningModalOpen(false);
        alert("Budget plan saved successfully!");
      } catch (error) {
        console.error("Plan save error:", error.response?.data);
        alert("Error saving plan: " + (error.response?.data?.detail || "Unknown error"));
      }
  };

  const handleStartNew = () => {
    if (window.confirm("Start a new month? The current plan will be preserved in history.")) {
      setBudgetPeriod(null);
      setExistingPlans([]);
      setIsEditing(false);
      // This allows the BudgetPeriodForm to show empty fields again
    }
  };

  return (
    <div className={styles.container}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#2d3748' }}>Budget Settings</h2>
        
        {/* Show 'Start New' only if we are currently editing an active month */}
        {isEditing && (
          <button 
            onClick={handleStartNew}
            style={{ backgroundColor: '#edf2f7', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', border: '1px solid #cbd5e0' }}
          >
            ➕ Start New Month
          </button>
        )}
      </header>

      {/* 1. Monthly Setup */}
      <BudgetPeriodForm 
        onSave={handleSaveBudget} 
        onOpenPlanning={() => setIsPlanningModalOpen(true)}
        hasActivePeriod={!!budgetPeriod}
        initialData={budgetPeriod} // This fills the inputs if data exists
      />

      {/* 2. Category Management */}
      <CategoryManager 
        categories={categories} 
        onAddCategory={handleAddCategory} 
        onDeleteCategory={handleDeleteCategory} 
      />

      {/* 3. NEW: The Planning Modal (The "Box") */}
      <Modal 
        isOpen={isPlanningModalOpen} 
        onClose={() => setIsPlanningModalOpen(false)} 
        title={`Plan for ${budgetPeriod?.month_year || 'New Month'}`}
      >
        <BudgetPlanner 
          categories={categories} 
          budgetPeriod={budgetPeriod}
          onSavePlan={handleSaveBulkPlan} 
          existingPlans={existingPlans}
        />
      </Modal>
    </div>
  );
}