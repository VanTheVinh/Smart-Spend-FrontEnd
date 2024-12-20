import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getUserInfo, updateUser } from '~/services/userService'; // Dịch vụ lấy và cập nhật thông tin người dùng
import { AppContext } from '~/contexts/appContext';
import { uploadAvatar } from '~/services/userService'; // Dịch vụ upload avatar

const Profile = () => {
  const [userData, setUserData] = useState({
    username: '',
    fullname: '',
    password: '',
    confirmPassword: '', // Mật khẩu xác nhận
  });
  const [loadingUserInfo, setLoadingUserInfo] = useState(true); // Trạng thái tải thông tin người dùng
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

  // Gọi API để lấy thông tin người dùng khi component được mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserInfo(userId);
        console.log('Data:', response);

        setUserData({
          username: response.username,
          fullname: response.fullname || '', // Cập nhật thông tin từ API
          password: '', // Mật khẩu không tải từ server, để trống
          confirmPassword: '', // Mật khẩu xác nhận không tải
        });
      } catch (error) {
        setError('Không thể tải thông tin người dùng.');
        console.error('Lỗi khi tải thông tin người dùng:', error);
      } finally {
        setLoadingUserInfo(false); // Đã tải xong thông tin người dùng
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Reset error message trước khi gửi request

    // Kiểm tra nếu mật khẩu mới và xác nhận mật khẩu không khớp
    if (userData.password !== userData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await updateUser(userId, userData);
      // Xử lý kết quả thành công (ví dụ, hiển thị thông báo hoặc cập nhật giao diện)
      console.log('Cập nhật thông tin người dùng thành công:', response);
    } catch (error) {
      // Xử lý lỗi (ví dụ, hiển thị thông báo lỗi)
      setError('Đã xảy ra lỗi trong quá trình cập nhật thông tin.');
      console.error('Lỗi khi cập nhật thông tin người dùng:', error);
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  // Nếu đang tải thông tin người dùng thì hiển thị loader
  if (loadingUserInfo) {
    return <p>Đang tải thông tin người dùng...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="user-info">
        <img
          src={userInfo.avatar}
          alt="Avatar"
          className="user-avatar"
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            objectFit: 'cover', // Đảm bảo ảnh không bị kéo dài và giữ đúng tỷ lệ
          }}
        />
        <p>{userInfo.fullname}</p>
        <input
          type="file"
          id="avatar-upload"
          onChange={handleAvatarUpload}
          disabled={isLoading} // Vô hiệu hóa khi đang upload
          accept="image/*" // Chỉ cho phép chọn file ảnh
        />
        {isLoading && <p>Đang tải ảnh...</p>}{' '}
        {/* Hiển thị thông báo khi đang tải */}
        {error && <p style={{ color: 'red' }}>{error}</p>}{' '}
        {/* Hiển thị thông báo lỗi nếu có */}
      </div>
      <div>
        <label>Tên đăng nhập</label>
        <input
          type="text"
          name="username"
          value={userData.username}
          onChange={handleInputChange}
          disabled // Không cho phép thay đổi tên đăng nhập
        />
      </div>
      <div>
        <label>Họ và tên</label>
        <input
          type="text"
          name="fullname"
          value={userData.fullname}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>Mật khẩu mới</label>
        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>Xác nhận mật khẩu</label>
        <input
          type="password"
          name="confirmPassword"
          value={userData.confirmPassword}
          onChange={handleInputChange}
        />
      </div>

      <button type="submit" disabled={isLoading}>
        Cập nhật thông tin
      </button>

      {isLoading && <p>Đang cập nhật...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default Profile;
