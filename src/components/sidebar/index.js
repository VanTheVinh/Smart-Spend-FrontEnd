import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Thêm useLocation
import { logout } from '~/services/authService';
import { getUserInfo } from '~/services/userService';
import { AppContext } from '~/contexts/appContext';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const { userId } = useContext(AppContext);
  const [avatar, setAvatar] = useState(''); // State để lưu avatar người dùng
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
        const userInfo = await getUserInfo(userId);
        setAvatar(
          userInfo.avatar ||
            'https://raw.githubusercontent.com/VanTheVinh/avatars-storage-spend-web/main/default_avatar.jpg',
        );
      } catch (error) {
        console.error('Lỗi khi lấy avatar:', error);
      }
    };

    if (userId) {
      fetchUserAvatar();
    }
  }, [userId]);

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
    <div className="flex flex-col min-h-screen bg-tealBGDaskboard overflow-hidden">
      <header className="w-full bg-teal-600 text-white py-2 px-6 flex items-center justify-between fixed top-0 left-0 z-10">
        <div className="flex items-center">
          <button>
          <i  
            className="fa-solid fa-bars cursor-pointer"
            onClick={() => {
              console.log('Sidebar Open:', !isSidebarOpen);  // Debugging
              setIsSidebarOpen(!isSidebarOpen);
            }} 
          />
          </button>
          <h1 className="ml-4 text-2xl font-semibold">
            Ứng dụng quản lý chi tiêu
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <i className="fa-solid fa-bell cursor-pointer" />
          <i className="fa-solid fa-cog cursor-pointer" />
        </div>
      </header>
      <div className="flex flex-row mt-20 min-h-screen">
        <div className={`w-72 bg-tealDashboard text-black font-bold flex flex-col transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col mt-3 items-center py-6">
            <div className="w-36 h-36 rounded-full bg-tealEdit flex items-center justify-center">
              <img
                src={avatar} // Dùng avatar từ state
                alt="User Avatar"
                className="w-full h-full rounded-full object-cover"
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
                isActive('/home')
                  ? 'bg-teal-600 text-white'
                  : 'hover:bg-tealFirsttd'
              }`}
            >
              <i className="fa-solid fa-house"></i>
              <div className="ml-3">Trang chủ</div>
            </button>
            <button
              onClick={() => navigate('/user-bill')}
              className={`flex items-center px-6 py-3 rounded-lg ${
                isActive('/user-bill')
                  ? 'bg-teal-600 text-white'
                  : 'hover:bg-tealFirsttd'
              }`}
            >
              <i className="fa-solid fa-file-invoice-dollar"></i>
              <div className="ml-5">Hóa đơn</div>
            </button>
            <button
              onClick={() => navigate('/user-category')}
              className={`flex items-center px-6 py-3 rounded-lg ${
                isActive('/category')
                  ? 'bg-teal-600 text-white'
                  : 'hover:bg-tealFirsttd'
              }`}
            >
              <i className="fa-solid fa-layer-group"></i>
              <div className="ml-3">Danh mục</div>
            </button>
            <button
              onClick={() => navigate('/group')}
              className={`flex items-center px-6 py-3 rounded-lg ${
                isActive('/group')
                  ? 'bg-teal-600 text-white'
                  : 'hover:bg-tealFirsttd'
              }`}
            >
              <i className="fa-solid fa-users-viewfinder"></i>
              <div className="ml-3">Quỹ nhóm</div>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className={`flex items-center px-6 py-3 rounded-lg ${
                isActive('/profile')
                  ? 'bg-teal-600 text-white'
                  : 'hover:bg-tealFirsttd'
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
        <div
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? 'ml-0' : 'ml-[-96px]'
          }`}
        >
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
