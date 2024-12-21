import axios from 'axios';

const API_URL = 'https://smart-spend-backend-production.up.railway.app'; // Địa chỉ API của Flask

// Hàm đăng ký
export const register = (username, password, fullname) => {
  return axios.post(`${API_URL}/register`, {
    username,
    password,
    fullname,
  });
};

// Hàm đăng nhập
export const login = (username, password) => {
  return axios.post(`${API_URL}/login`, {
    username,
    password,
  });
};

// Hàm đăng xuất
export const logout = () => {
  return axios.post(`${API_URL}/logout`);
};
