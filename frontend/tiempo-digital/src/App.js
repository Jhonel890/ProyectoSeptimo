import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboardTrabajador/dashboardTrabajador';
import Login from './pages/login/login';
import NotFound from './pages/notfound';
import Register from './pages/register/register';
import DashboardContratista from './pages/dashboardContratista/dashboardContratista';
import CrearPreguntas from './pages/crearTrabajo/crearTrabajo';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/principal" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/contratista" element={<DashboardContratista />} />
        <Route path="/crearPregunta" element={<CrearPreguntas />} />
        
      </Routes>
    </Router>
  );
};

export default App;
