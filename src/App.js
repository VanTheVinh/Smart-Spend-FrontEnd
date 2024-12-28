import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'; // Sử dụng HashRouter

import AppRouter from './routes'; // Các route yêu cầu đăng nhập
import Login from './pages/login';
import Register from './pages/register';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';
import Home from './pages/home';
    
const App = () => {
  const [loading, setLoading] = useState(true); // Trạng thái chờ

  useEffect(() => {
    // Kiểm tra nếu có accessToken trong localStorage
    const accessToken = localStorage.getItem('access_token');
    console.log('Access token:', accessToken);
    setLoading(false); // Kết thúc trạng thái chờ
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Hoặc hiển thị giao diện chờ
  }

  // Kiểm tra nếu có accessToken trong localStorage
  const isAuthenticated = !!localStorage.getItem('access_token');

  return (
    <div className="App">
      <HashRouter>
        <div className="app-container">
          {/* Sidebar có thể được hiển thị ở đây */}
          <div className="content">
            {/* Điều hướng theo trạng thái đăng nhập */}
            <Routes>
              {/* Route cho trang quên mật khẩu và reset mật khẩu luôn có thể truy cập */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/home" element={<Home />} />

              {/* Route bảo vệ cho các route cần đăng nhập */}
              {isAuthenticated ? (
                <Route path="/*" element={<AppRouter />} />
              ) : (
                // Nếu chưa đăng nhập, điều hướng người dùng về trang login hoặc các trang không yêu cầu đăng nhập
                <Route path="/*" element={<Navigate to="/home" />} />
              )}
            </Routes>
          </div>
        </div>
      </HashRouter>
    </div>
  );
};

export default App;
