import axios from 'axios';

const API_URL = 'https://smart-spend-backend-production.up.railway.app'; // Địa chỉ API của Flask

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

export const addBill = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/add-bill`, data);
    return response.data; // Trả về phản hồi từ server
  } catch (error) {
    console.error('Lỗi khi thêm hóa đơn:', error);
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
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

export const updateBill = async (billId, data) => {
  try {
      const response = await axios.put(`${API_URL}/update-group/${billId}`, data);
      return response.data; // Trả về phản hồi từ server
  } catch (error) {
      console.error("Lỗi khi cập nhật nhóm:", error);
      throw error; // Ném lỗi để xử lý ở nơi khác
  }
};

export const deleteBill = async (billId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-bill/${billId}`);
    return response.data; // Trả về danh sách hóa đơn
  } catch (error) {
    console.error('Lỗi khi lấy danh sách hóa đơn:', error);
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
};

// Hàm lọc hóa đơn
export const filterBills = async (params) => {
  try {
    const response = await axios.get(`${API_URL}/filter-bills`, { params });
    return response.data; // Trả về danh sách hóa đơn đã lọc
  } catch (error) {
    console.error('Lỗi khi lấy danh sách hóa đơn:', error);
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
};