import React , { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '~/services/authService'; // Giả sử bạn đã có hàm `logout` trong authService
import { AppContext } from '~/contexts/appContext';

const Dashboard = () => {
  const navigate = useNavigate();

  const { userId } = useContext(AppContext);
  console.log("User ID:", userId); // In ra userId để kiểm tra


  const handleLogout = async () => {
    try {
      await logout(); // Gọi API đăng xuất
      localStorage.removeItem('user_id'); // Xóa user_id khỏi localStorage
      localStorage.removeItem('budget'); // Xóa user_id khỏi localStorage
      navigate('/login'); // Điều hướng người dùng về trang đăng nhập
    } catch (error) {
      console.error('Đăng xuất thất bại', error);
    }
  };

  const handleBill = async () => {
    try {
      navigate('/user-bill');
    } catch (error) {
      console.error('Thất bại', error);
    }
  };

  const handleCategory = async () => {
    try {
      navigate('/category');
    } catch (error) {
      console.error('Thất bại', error);
    }
  };

  const handleGroup = async () => {
    try {
      navigate('/group'); 
    } catch (error) {
      console.error('Thất bại', error);
    }
  };

  return (
    <div>
      <h1>Chào mừng bạn đến với Trang Chủ!</h1>
      <button onClick={handleBill}>Hóa đơn của bạn</button>
      <button onClick={handleCategory}>Danh mục của bạn</button>
      <button onClick={handleGroup}>Quỹ nhóm</button>
      <br></br>
      <br></br>
      <button onClick={handleLogout}>Đăng Xuất</button>
    </div>
  );
};

export default Dashboard;
