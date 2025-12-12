import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DomainSelectorPage from './pages/DomainSelectorPage';
import ChatPage from './pages/ChatPage';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize from localStorage
    return !!localStorage.getItem('user_id');
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check auth status on mount
    const userId = localStorage.getItem('user_id');
    console.log('App.jsx - Initial check, user_id:', userId);
    setIsAuthenticated(!!userId);
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    console.log('App.jsx - handleLoginSuccess called');
    const userId = localStorage.getItem('user_id');
    console.log('App.jsx - After login, user_id:', userId);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    console.log('App.jsx - handleLogout called');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    localStorage.removeItem('selected_domain');
    setIsAuthenticated(false);
    console.log('App.jsx - After logout, user_id:', localStorage.getItem('user_id'));
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  console.log('App.jsx - Rendering with isAuthenticated:', isAuthenticated);

  return (
    <Router>
      <Routes>
        {/* Home Route - accessible to everyone */}
        <Route 
          path="/home" 
          element={<HomePage />}
        />

        {/* Login Route */}
        {!isAuthenticated ? (
          <Route 
            path="/login" 
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />
        ) : (
          <Route 
            path="/login" 
            element={<Navigate to="/domain-selector" replace />}
          />
        )}

        {/* Register Route */}
        {!isAuthenticated ? (
          <Route 
            path="/register" 
            element={<RegisterPage />}
          />
        ) : (
          <Route 
            path="/register" 
            element={<Navigate to="/domain-selector" replace />}
          />
        )}

        {/* Domain Selector Route */}
        {isAuthenticated ? (
          <Route 
            path="/domain-selector" 
            element={<DomainSelectorPage onLogout={handleLogout} />}
          />
        ) : (
          <Route 
            path="/domain-selector" 
            element={<Navigate to="/login" replace />}
          />
        )}

        {/* Chat Route */}
        {isAuthenticated ? (
          <Route 
            path="/chat" 
            element={<ChatPage />}
          />
        ) : (
          <Route 
            path="/chat" 
            element={<Navigate to="/login" replace />}
          />
        )}

        {/* Root Route - redirects to home */}
        <Route 
          path="/" 
          element={<Navigate to="/home" replace />}
        />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;