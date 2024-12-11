import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '~/services/authService';
import { AppContext } from '~/contexts/appContext';

const Login = () => {
  const { setUserId, userId, setBudget } = useContext(AppContext);
  console.log("User ID:", userId); // Kiểm tra giá trị userId từ context

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Trạng thái tải
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Kiểm tra trường nhập liệu
    if (!username.trim() || !password.trim()) {
      setMessage('Vui lòng điền đầy đủ tên người dùng và mật khẩu.');
      return;
    }

    setLoading(true);
    setMessage(''); // Xóa thông báo cũ

    try {
      const response = await login(username, password);      

      const userId = response.data.user_info.user_id; // Lấy user_id từ phản hồi API
      const budget = response.data.user_info.budget;
      
      setBudget(budget); // Lưu budget vào context
      setUserId(userId); // Lưu user_id vào context
      setMessage(response.data.message);

      localStorage.setItem('user_id', userId); // Lưu vào localStorage
      localStorage.setItem('budget', budget); // Lưu vào localStorage
      navigate('/dashboard'); // Chuyển hướng tới dashboard
      // console.log(response.data.user_info.user_id); 
      
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message); // Hiển thị thông báo từ server
      } else {
        setMessage('Đã xảy ra lỗi khi kết nối đến server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Đăng Nhập</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Tên Người Dùng:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập tên người dùng"
          />
        </div>
        <div>
          <label htmlFor="password">Mật Khẩu:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
        </button>
      </form>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
};

export default Login;
