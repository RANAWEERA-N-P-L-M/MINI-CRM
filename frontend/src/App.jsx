import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';


import InquiryForm from './pages/InquiryForm';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InquiryDetail from './pages/InquiryDetail';


import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
       
        <Navbar />
        
        
        <main>
          <Routes>
            
            <Route path="/" element={<InquiryForm />} />
            <Route path="/login" element={<Login />} />
            
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inquiry/:id"
              element={
                <ProtectedRoute>
                  <InquiryDetail />
                </ProtectedRoute>
              }
            />
            
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;