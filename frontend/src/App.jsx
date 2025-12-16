import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import { ProtectedRoute, RoleProtectedRoute } from './components/ProtectedRoute';

//  Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

//  Public Pages
import Home from './pages/Home/Home';         
import Login from './pages/Login/Login';      
import Register from './pages/Register/Register'; 

//  Protected Pages (Role-based)
import MemberDashboard from './pages/Dashboard/MemberDashboard';
import TrainerDashboard from './pages/Dashboard/TrainerDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gym-black text-white flex flex-col">
          
          <Navbar />

          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes - Member Only */}
              <Route 
                path="/member/dashboard" 
                element={
                  <RoleProtectedRoute allowedRoles={['member']}>
                    <MemberDashboard />
                  </RoleProtectedRoute>
                } 
              />

              {/* Protected Routes - Trainer Only */}
              <Route 
                path="/trainer/dashboard" 
                element={
                  <RoleProtectedRoute allowedRoles={['trainer']}>
                    <TrainerDashboard />
                  </RoleProtectedRoute>
                } 
              />
              
              {/* Redirect untuk /dashboard umum (auto redirect sesuai role) */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardRedirect />
                  </ProtectedRoute>
                } 
              />

              {/* Redirect URL yang tidak valid */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
          
        </div>
      </Router>
    </AuthProvider>
  );
}

// Component untuk auto-redirect dashboard sesuai role
const DashboardRedirect = () => {
  const { user } = useAuth();
  
  if (user?.role === 'trainer') {
    return <Navigate to="/trainer/dashboard" replace />;
  }
  
  return <Navigate to="/member/dashboard" replace />;
};

export default App;