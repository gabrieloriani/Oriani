import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import '@/App.css';
import Home from '@/pages/Home';
import Gallery from '@/pages/Gallery';
import Admin from '@/pages/Admin';
import Login from '@/pages/Login';
import Orcamento from '@/pages/Orcamento';
import ServicePage from '@/pages/ServicePage';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const AuthContext = React.createContext();

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/galeria" element={<Gallery />} />
          <Route path="/galeria/:category" element={<Gallery />} />
          <Route path="/servicos/:category" element={<ServicePage />} />
          <Route path="/orcamento" element={<Orcamento />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={token ? <Admin /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;