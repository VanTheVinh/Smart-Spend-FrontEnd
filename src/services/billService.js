import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Địa chỉ API của Flask

export const bill = (
  type,
  amount,
  date,
  description,
  user_id,
  category_id,
) => {
  return axios.post(`${API_URL}/bill`, {
    type,
    amount,
    date,
    description,
    user_id,
    category_id,
  });
};

export const getBills = async (params) => {
  try {
    const response = await axios.get(`${API_URL}/get-bills`, { params });
    return response.data; // Trả về danh sách hóa đơn
  } catch (error) {
    console.error('Lỗi khi lấy danh sách hóa đơn:', error);
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
};
