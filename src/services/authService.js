import axios from 'axios';

// const API_URL_DEPLOYED = 'https://smart-spend-backend-production.up.railway.app'; 
const API_URL_LOCAL = 'http://127.0.0.1:5000'; 

// Hàm đăng ký
export const register = async (data) => {
  try {
    const response = await axios.post(`${API_URL_LOCAL}/register`, data);
    return response.data; // Trả về phản hồi từ server
  } catch (error) {
    console.error('Lỗi khi đăng ký tài khoản:', error);
    throw error; 
  }
};

// Hàm đăng nhập
export const login = (username, password) => {
  return axios.post(`${API_URL_LOCAL}/login`, {
    username,
    password,
  });
};

// Hàm đăng xuất
export const logout = () => {
  return axios.post(`${API_URL_LOCAL}/logout`);
};
