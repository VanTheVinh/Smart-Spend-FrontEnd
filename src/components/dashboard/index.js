import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import UserBill from '~/pages/bill/userBill';
import UserCategory from '~/pages/category/userCategory';
import Group from '~/pages/group';
import Profile from '~/pages/profile';
import GroupDetail from '~/pages/group/groupDetail'; // Import GroupDetail
import { getUserInfo } from '~/services/userService';
import { AppContext } from '~/contexts/appContext';
import { logout } from '~/services/authService';
import AlertComponent from '../alert';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { groupId } = useParams();
  const { userId, setIsAuthenticated } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState('UserBill');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [avatar, setAvatar] = useState('');
  const [fullName, setFullName] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Thêm state để điều khiển hiển thị alert

  const pages = {
    UserBill: <UserBill />,
    UserCategory: <UserCategory />,
    Group: <Group />,
    Profile: <Profile />,
  };

  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
        const userInfo = await getUserInfo(userId);
        setAvatar(
          userInfo.avatar ||
            'https://raw.githubusercontent.com/VanTheVinh/avatars-storage-spend-web/main/default_avatar.jpg',
        );
        setFullName(userInfo.fullname);
      } catch (error) {
        console.error('Lỗi khi lấy avatar:', error);
      }
    };

    if (userId) {
      fetchUserAvatar();
    }
  }, [userId]);

  const handleLogout = async () => {
    const confirmLogout = window.confirm(
      'Bạn có chắc chắn muốn đăng xuất không?'
    );
    if (!confirmLogout) {
      return;
    }

    try {
      await logout();
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_id');

      setIsAuthenticated(false);
      navigate('/home');
      window.location.reload();
    } catch (error) {
      console.error('Đăng xuất thất bại', error);
    }
  };

  const isGroupDetailPage = location.pathname.startsWith('/group-detail/');

  // Hàm mở/đóng AlertComponent
  const toggleAlert = () => {
    setIsAlertOpen(!isAlertOpen);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <header className="w-full bg-tealColor11 text-white py-2 px-6 flex items-center justify-between fixed top-0 left-0 z-10">
        <div className="flex items-center">
          <button>
            <i
              className="fa-solid fa-bars cursor-pointer"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          </button>
          <h1 className="ml-4 text-2xl font-semibold">Ứng dụng quản lý chi tiêu</h1>
        </div>
        <div className="flex items-center pr-12">
          {/* Icon chuông, khi click sẽ hiển thị AlertComponent */}
          <button onClick={toggleAlert}>
            <i className="fa-solid fa-bell cursor-pointer text-2xl"></i>
          </button>
        </div>
      </header>

      <div className="flex mt-20">
        {/* Sidebar */}
        <div
          className={`fixed left-0 min-h-screen bg-tealColor06 text-black font-bold flex flex-col transform transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ width: '20rem' }}
        >
          <div className="flex flex-col mt-20 items-center py-6">
            <div className="w-36 h-36 rounded-full bg-tealEdit flex items-center justify-center">
              <img
                src={avatar}
                alt="User Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h2 className="mt-4 text-3xl font-bold">{fullName || 'Người dùng'}</h2>
            <hr className="w-full border-t-1 border-tealEdit mt-6" />
          </div>

          <ul className="flex flex-col mt-4 cursor-pointer">
            <li
              onClick={() => setCurrentPage('Home')}
              className={`flex items-center py-4 pl-10 ${
                currentPage === 'Home' ? 'bg-teal-600 text-white' : 'hover:bg-tealColor08'
              }`}
            >
              <i className="fa-solid fa-house"></i>
              <div className="ml-3">Trang chủ</div>
            </li>

            <li
              onClick={() => setCurrentPage('UserBill')}
              className={`flex items-center py-4 pl-10 ${
                currentPage === 'UserBill' ? 'bg-teal-600 text-white' : 'hover:bg-tealColor08'
              }`}
            >
              <i className="fa-solid fa-file-invoice-dollar"></i>
              <div className="ml-3">Hóa đơn</div>
            </li>

            <li
              onClick={() => setCurrentPage('UserCategory')}
              className={`flex items-center py-4 pl-10 ${
                currentPage === 'UserCategory' ? 'bg-teal-600 text-white' : 'hover:bg-tealColor08'
              }`}
            >
              <i className="fa-solid fa-layer-group"></i>
              <div className="ml-3">Danh mục</div>
            </li>

            <li
              onClick={() => setCurrentPage('Group')}
              className={`flex items-center py-4 pl-10 ${
                currentPage === 'Group' ? 'bg-teal-600 text-white' : 'hover:bg-tealColor08'
              }`}
            >
              <i className="fa-solid fa-users-viewfinder"></i>
              <div className="ml-3">Nhóm</div>
            </li>
            <li
              onClick={() => setCurrentPage('Profile')}
              className={`flex items-center py-4 pl-10 ${
                currentPage === 'Profile' ? 'bg-teal-600 text-white' : 'hover:bg-tealColor08'
              }`}
            >
              <i className="fa-regular fa-user"></i>
              <div className="ml-3">Thông tin</div>
            </li>
            <li
              onClick={handleLogout}
              className="flex items-center px-6 py-4 ml-4 hover:bg-tealColor06"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <div className="ml-3">Đăng xuất</div>
            </li>
          </ul>
        </div>

        {/* Main content */}
        <main
          className="flex-grow container mx-auto bg-gray-100 h-screen overflow-auto transition-all duration-300"
          style={{
            marginLeft: isSidebarOpen ? '20rem' : '0',
          }}
        >
          {isGroupDetailPage ? (
            <GroupDetail groupId={groupId} />
          ) : (
            Object.keys(pages).map((page) => (
              <div
                key={page}
                style={{ display: currentPage === page ? 'block' : 'none' }}
              >
                {pages[page]}
              </div>
            ))
          )}

          {/* Thêm component AlertComponent */}
          {isAlertOpen && <AlertComponent bills={[]} />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
