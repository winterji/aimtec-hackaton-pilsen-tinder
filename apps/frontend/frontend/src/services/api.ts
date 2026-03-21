import axios from 'axios';

// Vytvoříme instanci pro klientský frontend
export const api = axios.create({
  // Předpokládáme, že backend běží na portu 3000
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://backend:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pro automatické přidávání tokenu (pokud existuje)
api.interceptors.request.use((config) => {
  // Na frontendu můžeme token ukládat pod jiným klíčem, např. 'userToken'
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor pro řešení chyb (např. vypršený token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Pokud dostaneme 401, můžeme uživatele odhlásit nebo smazat neplatný token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userToken');
      }
    }
    return Promise.reject(error);
  }
);