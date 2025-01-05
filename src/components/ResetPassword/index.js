import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams(); // Lấy token từ URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      const response = await axios.post(`http://127.0.0.1:5000/reset-password/${token}`, { password });
      setMessage(response.data.message);
      setError('');
      // Điều hướng sau khi đặt lại mật khẩu thành công
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Đã xảy ra lỗi.');
      setMessage('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="bg-white p-8 rounded-xl shadow-lg w-11/12 max-w-md">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
      Đặt lại mật khẩu
    </h2>
    {message && (
      <p className="text-green-600 bg-green-100 p-3 rounded-lg text-center mb-4">
        {message}
      </p>
    )}
    {error && (
      <p className="text-red-600 bg-red-100 p-3 rounded-lg text-center mb-4">
        {error}
      </p>
    )}
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="password"
          className="block text-gray-700 font-semibold mb-2"
        >
          Mật khẩu mới:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 border-gray-300"
          placeholder="Nhập mật khẩu mới"
        />
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-gray-700 font-semibold mb-2"
        >
          Xác nhận mật khẩu:
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 border-gray-300"
          placeholder="Nhập lại mật khẩu"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 text-white font-bold rounded-lg bg-teal-500 hover:bg-teal-600 transition"
      >
        Đặt lại mật khẩu
      </button>
    </form>
  </div>
</div>

  );
};

export default ResetPassword;
