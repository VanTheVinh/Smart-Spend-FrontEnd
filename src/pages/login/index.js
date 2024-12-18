import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '~/services/authService';
import { AppContext } from '~/contexts/appContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const { setUserId, setBudget } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

    if (!validateForm()) {
      return; // Nếu form không hợp lệ, dừng lại
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
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type={passwordVisible ? 'text' : 'password'} // Hiển thị mật khẩu nếu passwordVisible là true
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
            
            <FontAwesomeIcon
              icon={passwordVisible ? faEyeSlash : faEye} // Hiển thị icon tương ứng
              onClick={() => setPasswordVisible(!passwordVisible)} // Đổi trạng thái hiển thị mật khẩu
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
              }}
            />
          </div>
        </div>
        {message && <p style={{ color: 'red' }}>{message}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
        </button>
        <div>
          <Link to="/register">Đăng ký</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
