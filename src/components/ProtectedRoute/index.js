import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem('access_token');

  if (!accessToken) {
    // Nếu chưa có access token, điều hướng về trang đăng nhập
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
