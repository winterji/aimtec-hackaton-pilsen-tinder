import axios from 'axios';

// Vytvoříme instanci, která míří na vaši hlavní "Tinder" aplikaci (backend)
export const api = axios.create({
  baseURL: 'http://13.51.36.227:3000/api', // V produkci to bude např. https://api.plzenswipe.cz/api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Než se požadavek odešle, zkontroluje, jestli máme token
api.interceptors.request.use((config) => {
  // Token si po přihlášení uložíme do localStorage (nebo cookies)
  const token = localStorage.getItem('adminToken');
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});