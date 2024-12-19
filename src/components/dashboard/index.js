import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Thêm useLocation
import { logout } from '~/services/authService';
import { AppContext } from '~/contexts/appContext';
import { Outlet } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const { userId } = useContext(AppContext);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('user_id');
      localStorage.removeItem('budget');
      navigate('/login');
    } catch (error) {
      console.error('Đăng xuất thất bại', error);
    }
  };

  // Xác định nút nào đang được chọn dựa trên đường dẫn hiện tại
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-tealBGDaskboard">
      <div className="w-72 bg-tealDashboard text-black font-bold flex flex-col">
        <div className="flex flex-col mt-3 items-center py-6">
          <div className="w-36 h-36 rounded-full bg-tealEdit flex items-center justify-center">
            <img
              src="https://via.placeholder.com/150"
              alt="User Avatar"
              className="w-full h-full rounded-full"
            />
          </div>
          <h2 className="mt-4 text-lg font-semibold">
            {userId || 'Người dùng'}
          </h2>
          <hr className="w-full border-t-2 border-tealEdit mt-6" />
        </div>
        <nav className="flex flex-col mt-4 space-y-4 px-4">
          <button
            onClick={() => navigate('/home')}
            className={`flex items-center px-6 py-3 rounded-lg ${
              isActive('/home') ? 'bg-teal-600 text-white' : 'hover:bg-tealFirsttd'
            }`}
          >
            <i className="fa-solid fa-house"></i>
            <div className="ml-3">Trang chủ</div>
          </button>
          <button
            onClick={() => navigate('/user-bill')}
            className={`flex items-center px-6 py-3 rounded-lg ${
              isActive('/user-bill') ? 'bg-teal-600 text-white' : 'hover:bg-tealFirsttd'
            }`}
          >
            <i className="fa-solid fa-file-invoice-dollar"></i>
            <div className="ml-5">Hóa đơn</div>
          </button>
          <button
            onClick={() => navigate('/category')}
            className={`flex items-center px-6 py-3 rounded-lg ${
              isActive('/category') ? 'bg-teal-600 text-white' : 'hover:bg-tealFirsttd'
            }`}
          >
            <i className="fa-solid fa-layer-group"></i>
            <div className="ml-3">Danh mục</div>
          </button>
          <button
            onClick={() => navigate('/group')}
            className={`flex items-center px-6 py-3 rounded-lg ${
              isActive('/group') ? 'bg-teal-600 text-white' : 'hover:bg-tealFirsttd'
            }`}
          >
            <i className="fa-solid fa-users-viewfinder"></i>
            <div className="ml-3">Quỹ nhóm</div>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className={`flex items-center px-6 py-3 rounded-lg ${
              isActive('/profile') ? 'bg-teal-600 text-white' : 'hover:bg-tealFirsttd'
            }`}
          >
            <i className="fa-regular fa-user"></i>
            <div className="ml-4">Trang cá nhân</div>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center px-6 py-3 rounded-lg hover:bg-red-300"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <div className="ml-4">Đăng xuất</div>
          </button>
        </nav>
      </div>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
