import axios from 'axios';

// const API_URL_DELOYED = 'https://smart-spend-backend-production.up.railway.app'; // Địa chỉ API của Flask
const API_URL_LOCAL = 'http://127.0.0.1:5000'; // Địa chỉ API của Flask 


export const bill = (
  type,
  amount,
  date,
  description,
  user_id,
  category_id,
) => {
  return axios.post(`${API_URL_LOCAL}/bill`, {
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
    const response = await axios.post(`${API_URL_LOCAL}/add-bill`, data);
    return response.data; // Trả về phản hồi từ server
  } catch (error) {
    console.error('Lỗi khi thêm hóa đơn:', error);
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
};


export const getBills = async (params) => {
  try {
    const response = await axios.get(`${API_URL_LOCAL}/get-bills`, { params });
    return response.data; // Trả về danh sách hóa đơn
  } catch (error) {
    console.error('Lỗi khi lấy danh sách hóa đơn:', error);
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
};

export const getBillReport = async (params) => {
  try {
    const response = await axios.get(`${API_URL_LOCAL}/get-bill-report`, { params });
    return response.data; // Trả về dữ liệu báo cáo từ server
  } catch (error) {
    console.error('Lỗi khi lấy báo cáo hóa đơn:', error);
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
};


export const updateBill = async (billId, data) => {
  try {
      const response = await axios.put(`${API_URL_LOCAL}/update-bill/${billId}`, data);
      return response.data; // Trả về phản hồi từ server
  } catch (error) {
      console.error("Lỗi khi cập nhật nhóm:", error);
      throw error; // Ném lỗi để xử lý ở nơi khác
  }
};

export const deleteBill = async (billId) => {
  try {
    const response = await axios.delete(`${API_URL_LOCAL}/delete-bill/${billId}`);
    return response.data; // Trả về danh sách hóa đơn
  } catch (error) {
    console.error('Lỗi khi lấy danh sách hóa đơn:', error);
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
};

// Hàm lọc hóa đơn
export const filterBills = async (params) => {
  try {
    const response = await axios.get(`${API_URL_LOCAL}/filter-bills`, { params });
    return response.data; // Trả về danh sách hóa đơn đã lọc
  } catch (error) {
    console.error('Lỗi khi lấy danh sách hóa đơn:', error);
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
};