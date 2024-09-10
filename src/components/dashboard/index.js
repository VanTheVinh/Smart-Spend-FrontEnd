import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '~/services/authService'; // Giả sử bạn đã có hàm `logout` trong authService

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // Gọi API đăng xuất
      navigate('/auth/login'); // Điều hướng người dùng về trang đăng nhập
    } catch (error) {
      console.error('Đăng xuất thất bại', error);
    }
  };

  return (
    <div>
      <h1>Chào mừng bạn đến với Trang Chủ!</h1>
      <button onClick={handleLogout}>Đăng Xuất</button>
    </div>
  );
};

export default Dashboard;
