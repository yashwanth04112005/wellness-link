import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 

const ProtectedRoute = ({ component: Component }) => {
  const { isAuthenticated, loading } = useAuth(); 

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return isAuthenticated ? <Component /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;