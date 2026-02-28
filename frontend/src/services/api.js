import axios from 'axios';

const api = axios.create({
  // Add /api/v1 here so all requests automatically go to the right version
  baseURL: 'http://localhost:8000/api/v1',
});

export default api;