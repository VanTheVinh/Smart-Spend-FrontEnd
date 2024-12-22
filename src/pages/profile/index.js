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
    <div className="min-h-screen flex justify-center items-center overflow-x-hidden">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded- shadow-md p-11"
      >
        <div className="flex flex-col items-center">
          <img
            src={userInfo.avatar}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <input
            type="file"
            id="avatar-upload"
            onChange={handleAvatarUpload}
            disabled={isLoading}
            accept="image/*"
            className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-teal-100 file:text-tealCustom hover:file:bg-hovercolor"
          />
          {isLoading && <p className="text-tealCustom">Uploading...</p>}
          {error && <p className="text-red-500">{error}</p>}
        </div>

        <div className="my-4">
          <label className="block text-gray-700 text-xl font-bold mb-2">
            Tên người dùng
          </label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
            disabled
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-xl font-bold mb-2">
            Họ và tên
          </label>
          <input
            type="text"
            name="fullname"
            value={userData.fullname}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-tealCustom"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-xl font-bold mb-2">
            Mật khẩu mới
          </label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-tealCustom"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-xl font-bold mb-2">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-tealCustom"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-tealCustom text-white py-2 px-2 rounded-lg hover:bg-tealEdit transition duration-200"
        >
          Cập nhật thông tin
        </button>

        {isLoading && <p className="text-tealCustom">Cập nhật...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default Profile;
