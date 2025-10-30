// API client configuration
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

// Dummy function for trackJobView - can be implemented later if needed
export const trackJobView = () => {};

// Placeholder function for applyForJob - can be implemented later if needed
export const applyForJob = async () => {
  console.log("applyForJob called — placeholder function");
};

export { API_BASE_URL };