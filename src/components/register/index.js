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
        setMessage('Đã xảy ra lỗi.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#f0fdfa' }}>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Đăng Ký</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Họ Và Tên:</label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Nhập họ và tên"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-teal-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Tên Người Dùng:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên người dùng"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-teal-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Mật Khẩu:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-teal-300"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white font-bold rounded-md transition bg-teal-500 hover:bg-teal-600"
          >
            Đăng Ký
          </button>
        </form>
        {message && <p className="mt-4 text-red-500 font-semibold text-center">{message}</p>}
      </div>
    </div>
  );
};

export default Register;
