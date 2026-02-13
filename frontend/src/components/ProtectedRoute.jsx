import { Navigate } from 'react-router-dom';
import { authUtils } from '../services/api';


const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authUtils.isAuthenticated();
  
  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  
  return children;
};

export default ProtectedRoute;