import api from '../../../services/api'; // Use your existing api service

export const getTransactions = () => api.get('/transactions/');
export const getCategories = () => api.get('/categories/');

// Updated logic to handle both types
export const postTransaction = (data) => {
  if (data.is_planned) {
    // If it's a planned transaction, send to the budget-plans endpoint
    return api.post('/budget-plans/', {
      category_id: data.category_id,
      planned_amount: data.amount,
      month_year: data.date.substring(0, 7), // Extracts "YYYY-MM" from the date
    });
  } else {
    // Otherwise, send to the normal transactions endpoint
    return api.post('/transactions/', data);
  }
};

export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);