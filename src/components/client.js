// API client configuration
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

// Dummy function for trackJobView - can be implemented later if needed
export const trackJobView = () => {};

export { API_BASE_URL };