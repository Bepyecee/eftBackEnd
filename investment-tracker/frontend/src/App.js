import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EtfList from './components/EtfList';
import EtfForm from './components/EtfForm';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import AssetList from './components/AssetList';
import AssetForm from './components/AssetForm';
import Settings from './components/Settings';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';
import { ThemeProvider } from './contexts/ThemeContext';
import authService from './services/authService';
import './App.css';
import './themes.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Navigation />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/etfs" element={<EtfList />} />
                  <Route path="/etfs/new" element={<EtfForm />} />
                  <Route path="/etfs/edit/:id" element={<EtfForm />} />
                  <Route path="/etfs/:etfId/transactions" element={<TransactionList />} />
                  <Route path="/etfs/:etfId/transactions/new" element={<TransactionForm />} />
                  <Route path="/assets" element={<AssetList />} />
                  <Route path="/assets/new" element={<AssetForm />} />
                  <Route path="/assets/edit/:id" element={<AssetForm />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </PrivateRoute>
            }
          />
        </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

