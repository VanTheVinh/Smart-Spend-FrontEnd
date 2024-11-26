import React , { useState , useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '~/services/authService'; // Giả sử bạn đã có hàm `logout` trong authService
import { AppContext } from '~/contexts/appContext';

const Dashboard = () => {
  const navigate = useNavigate();

  const { setUserId, userId } = useContext(AppContext);
  console.log("User ID:", userId); // In ra userId để kiểm tra


  const handleLogout = async () => {
    try {
      await logout(); // Gọi API đăng xuất
      navigate('/auth/login'); // Điều hướng người dùng về trang đăng nhập
    } catch (error) {
      console.error('Đăng xuất thất bại', error);
    }
  };

  const handleBill = async () => {
    try {
      await logout(); // Gọi API đăng xuất
      navigate('/bill'); // Điều hướng người dùng về trang đăng nhập
    } catch (error) {
      console.error('Thất bại', error);
    }
  };

  const handleCategory = async () => {
    try {
      await logout(); // Gọi API đăng xuất
      navigate('/category'); // Điều hướng người dùng về trang đăng nhập
    } catch (error) {
      console.error('Thất bại', error);
    }
  };

  return (
    <div>
      <h1>Chào mừng bạn đến với Trang Chủ!</h1>
      <button onClick={handleBill}>Bill</button>
      <button onClick={handleLogout}>Đăng Xuất</button>
      <button onClick={handleCategory}>Danh mục</button>
    </div>
  );
};

export default Dashboard;
