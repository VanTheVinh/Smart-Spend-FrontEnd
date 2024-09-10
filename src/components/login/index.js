import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '~/services/authService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      navigate('/dashboard');
      setMessage(`${response.data.message}`);
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(`${error.response.data.message}`);
      } else {
        setMessage('Đã xảy ra lỗi khi kết nối đến server.');
      }
    }
  };

  return (
    <div>
      <h2>Đăng Nhập</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Tên Người Dùng:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Mật Khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Đăng Nhập</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
