import React, { useState } from 'react';
import { register } from '~/services/authService'; 

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await register(username, password, fullname);
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
      <h2>Đăng Ký</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Họ Và Tên:</label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>
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
        <button type="submit">Đăng Ký</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
