import axios from 'axios';

// const API_URL = 'https://smart-spend-backend-production.up.railway.app'; // Địa chỉ API của bạn
const API_URL_LOCAL = 'http://127.0.0.1:5000'; // Địa chỉ API của Flask 

// Hàm kiểm tra cảnh báo chi tiêu
export const checkSpendAlerts = async (userId) => {
  try {
    const response = await axios.post(`${API_URL_LOCAL}/spend-alert/check-alerts`, {
      user_id: userId,
    });
    return response.data; // Trả về dữ liệu cảnh báo chi tiêu
  } catch (error) {
    console.error('Lỗi khi kiểm tra cảnh báo chi tiêu:', error);
    throw error; // Để có thể xử lý lỗi ở nơi khác
  }
};
