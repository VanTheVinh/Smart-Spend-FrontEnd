import React, { useState } from 'react';
import { register } from '~/services/authService';
import { useNavigate } from 'react-router-dom';
import  '../../style/index.css';
const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!username) return 'Tên người dùng không được để trống.';
    if (!/^[a-zA-Z0-9_]{3,15}$/.test(username)) return 'Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới, từ 3-15 ký tự.';
    if (!fullname) return 'Tên người dùng không được để trống.';
    if (!password) return 'Mật khẩu không được để trống.';
    if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự.';
    if (!/[a-z]/.test(password)) return 'Mật khẩu phải chứa ít nhất một chữ cái viết thường.';
    if (!/[0-9]/.test(password)) return 'Mật khẩu phải chứa ít nhất một chữ số.';
    if (password !== confirmPassword) return 'Mật khẩu xác nhận không khớp.';
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errorMessage = validateInputs();
    if (errorMessage) {
      setMessage(errorMessage);
      return;
    }

    try {
      const response = await register(username, password, fullname);
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Đã xảy ra lỗi.');
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
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Nhập họ và tên"
              className="w-full px-2 py-1 border-b-2 border-gray-300 focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Tên người dùng:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên người dùng"
              className="w-full px-2 py-1 border-b-2 border-gray-300 focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Mật khẩu:</label>
            <input
              type="password"
              value={password}  
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="mb-3 w-full px-2 py-1 border-b-2 border-gray-300 focus:outline-none focus:border-teal-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-3 py-2 text-white font-bold rounded-md transition bg-tealCustom hover:bg-teal-700"
          >
            Đăng ký
          </button>
        </form>
        {message && <p className="mt-4 text-red-500 font-semibold text-center">{message}</p>}
      </div>
    </div>
  );
};

export default Register;
