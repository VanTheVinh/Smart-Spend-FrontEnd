import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '~/services/authService';
import { AppContext } from '~/contexts/appContext';
import './index.css'; // Import file index.css chứa cấu hình Tailwind

const Login = () => {
  const { setUserId, userId } = useContext(AppContext);
  console.log("User ID:", userId);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setMessage('Vui lòng điền đầy đủ tên người dùng và mật khẩu.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await login(username, password);
      const userId = response.data.user_info.user_id;
      setUserId(userId);
      localStorage.setItem('user_id', userId);
      setMessage(response.data.message);
      navigate('/dashboard');
      console.log(userId);
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Đã xảy ra lỗi khi kết nối đến server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen"style={{ backgroundColor: '#f0fdfa' }}>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Đăng Nhập</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">
              Tên Người Dùng:
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên người dùng"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-teal-300"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              Mật Khẩu:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-teal-300"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white font-bold rounded-md transition ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'
            }`}
          >
            {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
          </button>
        </form>
        {message && <p className="mt-4 text-red-500 font-semibold">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
