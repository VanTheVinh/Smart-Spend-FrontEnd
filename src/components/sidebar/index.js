import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getUserInfo } from '~/services/userService'; // Dịch vụ lấy thông tin người dùng
import { AppContext } from '~/contexts/appContext'; // Context chứa userId
import { uploadAvatar } from '~/services/userService'; // Dịch vụ upload avatar

const Sidebar = () => {
  const [userInfo, setUserInfo] = useState({ fullname: '', avatar: '' });
  const { userId } = useContext(AppContext); // Lấy userId từ context
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi

  // Lấy thông tin người dùng khi component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo(userId); // Lấy thông tin người dùng từ API
        console.log('Avatar:', data.avatar);

        setUserInfo({
          fullname: data.fullname,
          avatar:
            data.avatar ||
            'https://raw.githubusercontent.com/VanTheVinh/avatars-storage-spend-web/main/default_avatar.jpg', // URL ảnh GitHub mặc định
        });
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };

    fetchUserInfo();
  }, [userId]); // Chạy lại khi userId thay đổi

  // Xử lý upload avatar
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]; // Lấy file từ input
    if (file) {
      setIsLoading(true); // Bắt đầu loading khi upload

      try {
        const formData = new FormData();
        formData.append('avatar', file); // Gửi file avatar

        const response = await uploadAvatar(formData, userId); // Gọi service upload avatar
        console.log('Kết quả trả về từ API:', response); // Log kết quả từ API

        if (response && response.avatar_url) {
          setUserInfo((prevInfo) => ({
            ...prevInfo,
            avatar: `${response.avatar_url}?timestamp=${new Date().getTime()}`,
          }));
        }
      } catch (error) {
        setError('Lỗi khi tải ảnh lên. Vui lòng thử lại.');
        console.error('Lỗi khi upload avatar:', error);
      } finally {
        setIsLoading(false); // Kết thúc loading
      }
    }
  };

  return (
    <div className="sidebar">
      
      <ul>
        <li>
          <Link to="/home">Trang chủ</Link>
        </li>
        <li>
          <Link to="/user-bill">Hóa đơn</Link>
        </li>
        <li>
          <Link to="/category">Danh mục</Link>
        </li>
        <li>
          <Link to="/group">Quỹ nhóm</Link>
        </li>
        <li>
          <Link to="/update-user">Người dùng</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
