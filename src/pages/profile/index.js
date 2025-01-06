import React, { useState, useEffect, useContext } from 'react';
// import { Link } from 'react-router-dom';
import { getUserInfo, uploadAvatar } from '~/services/userService'; // Dịch vụ lấy và cập nhật thông tin người dùng
import { AppContext } from '~/contexts/appContext';

const Profile = () => {
  const [userData, setUserData] = useState({
    username: '',
    fullname: '',
    password: '',
    confirmPassword: '',
  });
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [userInfo, setUserInfo] = useState({ fullname: '', avatar: '' });
  const { userId } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Trạng thái thành công

  // Lấy thông tin người dùng khi component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo(userId);
        setUserInfo({
          fullname: data.fullname,
          avatar:
            data.avatar ||
            'https://raw.githubusercontent.com/VanTheVinh/avatars-storage-spend-web/main/default_avatar.jpg',
        });
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };

    fetchUserInfo();
  }, [userId]);

  // Xử lý upload avatar
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await uploadAvatar(formData, userId);
        if (response && response.avatar_url) {
          setUserInfo((prevInfo) => ({
            ...prevInfo,
            avatar: `${response.avatar_url}?timestamp=${new Date().getTime()}`,
          }));
          setSuccess('Cập nhật ảnh đại diện thành công.');
        }
      } catch (error) {
        setError('Lỗi khi tải ảnh lên. Vui lòng thử lại.');
        console.error('Lỗi khi upload avatar:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserInfo(userId);
        setUserData({
          username: response.username,
          fullname: response.fullname || '',
          password: '',
          confirmPassword: '',
        });
      } catch (error) {
        setError('Không thể tải thông tin người dùng.');
        console.error('Lỗi khi tải thông tin người dùng:', error);
      } finally {
        setLoadingUserInfo(false);
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
    setError('');
    setSuccess(null);
  
    if (userData.password !== userData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      setIsLoading(false);
      return;
    }
  
    try {
      // const response = await updateUser(userId, userData);
      setSuccess('Cập nhật thông tin người dùng thành công.');
  
      // Xóa dữ liệu trong ô mật khẩu
      setUserData((prevData) => ({
        ...prevData,
        password: '',
        confirmPassword: '',
      }));
    } catch (error) {
      setError('Đã xảy ra lỗi trong quá trình cập nhật thông tin.');
      console.error('Lỗi khi cập nhật thông tin người dùng:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

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
          className="w-full bg-tealColor11 text-white py-2 px-2 mb-8 rounded-lg hover:bg-tealEdit transition duration-200"
        >
          Cập nhật thông tin
        </button>

        {isLoading && <p className="text-tealCustom">Cập nhật...</p>}
        {success && <p className="text-green-500">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default Profile;
