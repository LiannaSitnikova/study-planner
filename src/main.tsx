import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <div className="p-6 text-center text-gray-700">
        Study Planner — налаштування AuthContext
      </div>
    </AuthProvider>
  </StrictMode>
);