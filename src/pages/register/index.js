import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { register } from '~/services/authService';
import '../../style/index.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateUsername = (value) => {
    if (!value) return 'Tên người dùng không được để trống.';
    if (!/^[a-zA-Z0-9_]{3,15}$/.test(value))
      return 'Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới, từ 3-15 ký tự.';
    return '';
  };

  const validateFullname = (value) => {
    if (!value) return 'Họ và tên không được để trống.';
    return '';
  };

  const validateEmail = (value) => {
    if (!value) return 'Email không được để trống.';
    if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/.test(value))
      return 'Email không hợp lệ.';
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return 'Mật khẩu không được để trống.';
    if (value.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự.';
    if (!/[a-z]/.test(value))
      return 'Mật khẩu phải chứa ít nhất một chữ cái viết thường.';
    if (!/[0-9]/.test(value)) return 'Mật khẩu phải chứa ít nhất một chữ số.';
    return '';
  };

  const validateConfirmPassword = (value) => {
    if (value !== password) return 'Mật khẩu xác nhận không khớp.';
    return '';
  };

  const handleInputChange = (field, value) => {
    let error = '';
    if (field === 'username') error = validateUsername(value);
    if (field === 'fullname') error = validateFullname(value);
    if (field === 'email') error = validateEmail(value);
    if (field === 'password') error = validatePassword(value);
    if (field === 'confirmPassword') error = validateConfirmPassword(value);

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    if (field === 'username') setUsername(value);
    if (field === 'fullname') setFullname(value);
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    if (field === 'confirmPassword') setConfirmPassword(value);
  };

  const showMessage = (msg, status) => {
    setMessage({ message: msg, status });
    setTimeout(() => {
      setMessage(null); // Ẩn thông báo sau 3 giây
    }, 3000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Gửi yêu cầu đăng ký
      const response = await register({
        username: username,
        password: password,
        fullname: fullname,
        email: email,
      });

      if (response) {
        showMessage(response.message, 'success'); // Hiển thị thông báo thành công
        setTimeout(() => {
          navigate('/login'); // Chuyển hướng đến trang đăng nhập sau 2 giây
        }, 2000);
      } else {
        showMessage('Đã xảy ra lỗi trong quá trình đăng ký.', 'error'); // Hiển thị thông báo lỗi
      }
    } catch (error) {
      showMessage(error.response?.data?.message || 'Đã xảy ra lỗi.', 'error'); // Hiển thị thông báo lỗi nếu có
    }
  };

  return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#f0fdfa' }}>
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Đăng ký</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Họ và tên:</label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => handleInputChange('fullname', e.target.value)}
              placeholder="Nhập họ và tên"
              className={`w-full px-2 py-1 border-b-2 ${errors.fullname ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-teal-500`}
            />
            {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Tên người dùng:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Nhập tên người dùng"
              className={`w-full px-2 py-1 border-b-2 ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-teal-500`}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Nhập email"
              className={`w-full px-2 py-1 border-b-2 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-teal-500`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Mật khẩu:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Nhập mật khẩu"
              className={`w-full px-2 py-1 border-b-2 ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-teal-500`}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Xác nhận mật khẩu:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Nhập lại mật khẩu"
              className={`w-full px-2 py-1 border-b-2 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-teal-500`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>
          <button type="submit" className="w-full px-3 py-2 text-white font-bold rounded-md transition bg-tealColor00">
            Đăng ký
          </button>
        </form>

        {/* Hiển thị thông báo */}
        {message && (
  <p
    className={`mt-4 font-semibold text-center py-3 px-5 rounded-md shadow-lg transition-all duration-300 ease-in-out transform 
    ${message.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} 
    opacity-0 animate-slide-up opacity-100`}
  >
    {message.message}
  </p>
)}


        <p className="mt-6 text-center text-gray-700">
          Đã có tài khoản?{' '}
          <span onClick={() => navigate('/login')} className="text-teal-500 font-bold cursor-pointer hover:underline">
            Đăng nhập
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
