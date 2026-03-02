import React, { useState, useEffect } from 'react';
import styles from './Settings.module.css';
import { CategoryManager } from './CategoryManager';
import { BudgetPeriodForm } from './BudgetPeriodForm';
import api from '../../services/api';
// import { getCategories, postCategory, saveBudgetSetup } from './api/settingsApi'; 

export default function SettingsPage() {
  const [categories, setCategories] = useState([]);
  // 1. Fetch categories from backend on mount
  useEffect(() => {
    loadCategories();
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
      // Since your baseURL is '.../api/v1', you only need the specific endpoint here
      const response = await api.post('/budget-periods/', budgetData);

      console.log("Successfully saved:", response.data);
      alert(`Budget initialized for ${response.data.month_year}!`);
      
    } catch (error) {
      // Axios puts the server's error message in error.response.data
      const message = error.response?.data?.detail || "Connection to server failed";
      console.error("Error saving budget:", message);
      alert("Error: " + message);
    }
  };

  return (
    <div className={styles.container}>
      <header>
        <h2 style={{ color: '#2d3748', marginBottom: '20px' }}>Budget Settings</h2>
      </header>

      {/* 1. Use the BudgetPeriodForm Component */}
      <BudgetPeriodForm onSave={handleSaveBudget} />

      {/* 2. Use the CategoryManager Component */}
      <CategoryManager 
        categories={categories} 
        onAddCategory={handleAddCategory} 
        onDeleteCategory={handleDeleteCategory} // Pass it here
      />
    </div>
  );
}