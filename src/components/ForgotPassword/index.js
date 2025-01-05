import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5000/reset-password',
        { email },
      );
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Đã xảy ra lỗi khi gửi yêu cầu');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Quên mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-semibold mb-2"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Nhập email của bạn"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 text-white font-bold bg-tealColor11 rounded-lg hover:bg-tealColor00 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          Gửi yêu cầu
        </button>
      </form>
      {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
