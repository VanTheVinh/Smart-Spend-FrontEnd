import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '~/services/authService';
import { AppContext } from '~/contexts/appContext';
import { HiEye, HiEyeOff } from 'react-icons/hi';
//import '../../style/index.css'; // Import file index.css chứa cấu hình Tailwind

const Login = () => {
  const { setUserId, userId, setBudget } = useContext(AppContext);
  console.log('User ID:', userId); // Kiểm tra giá trị userId từ context

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Trạng thái tải
  const [passwordVisible, setPasswordVisible] = useState(false); // Trạng thái hiển thị mật khẩu
  const navigate = useNavigate();

  const validateForm = () => {
    if (!username.trim()) {
      setMessage('Vui lòng điền tên người dùng.');
      return false;
    }
    if (!password.trim()) {
      setMessage('Vui lòng điền mật khẩu.');
      return false;
    }

    // Kiểm tra định dạng tên người dùng (chỉ cho phép chữ và số, từ 3-15 ký tự)
    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
    if (!usernameRegex.test(username)) {
      setMessage('Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới, từ 3-15 ký tự.');
      return false;
    }

    // Kiểm tra mật khẩu (ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số)
    const passwordRegex = /^(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      setMessage('Mật khẩu phải có ít nhất 6 ký tự,  một chữ cái viết thường và một chữ số.');
      return false;
    }

    return true;
  };

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

      const userId = response.data.user_info.user_id; // Lấy user_id từ phản hồi API
      const budget = response.data.user_info.budget;

      setBudget(budget); // Lưu budget vào context
      setUserId(userId); // Lưu user_id vào context
      setMessage(response.data.message);

      localStorage.setItem('user_id', userId); // Lưu vào localStorage
      localStorage.setItem('budget', budget); // Lưu vào localStorage
      navigate('/home'); // Chuyển hướng tới dashboard
      // console.log(response.data.user_info.user_id);
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
    <div
      className="flex items-center justify-center h-screen"
      style={{ backgroundColor: '#f0fdfa' }}
    >
      <div className="bg-white p-16 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Đăng nhập
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-semibold mb-2"
            >
              Tên người dùng:
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên người dùng"
              className="w-full px-2 py-1 border-b-2 border-gray-300 focus:outline-none focus:border-teal-500"
            />
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2"
            >
              Mật khẩu:
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full pr-10 px-2 py-1 border-b-2 border-gray-300 focus:outline-none focus:border-tealCustom"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)} // Chuyển đổi trạng thái hiển thị mật khẩu
            >
              {showPassword ? <HiEyeOff /> : <HiEye />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`mt-3 w-full px-4 py-2.5 text-white font-bold rounded-md transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-tealCustom :hoverbg-teal-600'
            }`}
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>

          <div className="flex justify-between items-center mt-4">
            <label className="flex items-center text-sm">
              <input type="checkbox" className="mr-2" />
              Lưu mật khẩu
            </label>
            <a href="#" className="text-sm text-gray-500 hover:underline">
              Quên mật khẩu?
            </a>
          </div>

          <div className="text-center mt-4">
            <label className="text-sm text-gray-500">
              Bạn chưa có tài khoản?
            </label>
            <a
              href="register"
              className="ml-2 tracking-wider text-center text-sm hover:underline"
            >
              Đăng ký
            </a>
          </div>
        </form>
        {message && (
          <p className="mt-4 text-red-500 font-semibold">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Login;