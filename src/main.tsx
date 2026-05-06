import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import {App} from './App.tsx';
import Dashboard from './viewResgiter.tsx'; // Tu nueva vista
import DashboardView from './viewMembresia.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Cuando la URL sea / se carga tu App gigante de siempre */}
        <Route path="/" element={<App />} />

        {/* Cuando escribas /registro manualmente, se carga solo la vista nueva */}
        <Route path="/registro" element={<Dashboard />} />

        <Route path="/membresia" element={<DashboardView />} />

        {/* Opcional: Cualquier otra ruta también puede ir a App o a un 404 */}
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);