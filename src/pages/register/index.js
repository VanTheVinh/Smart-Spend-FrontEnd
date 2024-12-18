import React, { useState } from 'react';
import { register } from '~/services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                paddingRight: '40px', // Tạo không gian cho icon
              }}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
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
        <div>
          <label>Xác Nhận Mật Khẩu:</label>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: '100%',
                paddingRight: '40px', // Tạo không gian cho icon
              }}
            />
            <FontAwesomeIcon
              icon={showConfirmPassword ? faEyeSlash : faEye}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
        <button type="submit">Đăng Ký</button>
        <div>
          <Link to="/login">Đăng nhập</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
