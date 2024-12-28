// groupService.js
import axios from 'axios';
// const API_URL = 'https://smart-spend-backend-production.up.railway.app'; // Địa chỉ API của bạn
const API_URL_LOCAL = 'http://127.0.0.1:5000'; // Địa chỉ API của Flask 


export const createGroup = async (data) => {
  try {
    const response = await axios.post(`${API_URL_LOCAL}/create-group`, data);
    return response.data; // Trả về phản hồi từ server
  } catch (error) {
    console.error('Lỗi khi tạo nhóm:', error);
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
};

export const getGroup = async (params) => {
  try {
      const response = await axios.get(`${API_URL_LOCAL}/get-group`, { params });
      return response.data; // Trả về danh sách nhóm
  } catch (error) {
      console.error("Lỗi khi lấy danh sách nhóm:", error);
      throw error; // Ném lỗi để xử lý ở nơi khác
  }
};

export const updateGroupDetail = async (groupId, data) => {
  try {
      const response = await axios.put(`${API_URL_LOCAL}/update-group/${groupId}`, data);
      return response.data; // Trả về phản hồi từ server
  } catch (error) {
      console.error("Lỗi khi cập nhật nhóm:", error);
      throw error; // Ném lỗi để xử lý ở nơi khác
  }
};

export const deleteGroup = async (data) => {
  try {
    const response = await axios.delete(`${API_URL_LOCAL}/delete-group`, { data });
    return response.data; // Trả về phản hồi từ server
  } catch (error) {
    console.error('Lỗi khi xóa nhóm:', error);
    throw error;
  }
};


export const getUserDetail = async (userId) => {
  try {
    // Gửi yêu cầu GET đến API để lấy thông tin chi tiết người dùng
    const response = await axios.get(`${API_URL_LOCAL}/users/${userId}`);
    return response.data; // Trả về thông tin người dùng
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
};

export const getGroupMembers = async (params) => {
  try {
    // Gửi yêu cầu GET đến API với các tham số cần thiết
    const response = await axios.get(`${API_URL_LOCAL}/get-member`, { params });
    return response.data; // Trả về danh sách thành viên nhóm
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thành viên nhóm:", error);
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
};

export const getGroupDetail = async (groupId) => {
  try {
    const response = await axios.get(`${API_URL_LOCAL}/get-group-detail`, {
      params: { group_id: groupId },
    });
    return response.data; // Trả về dữ liệu nhóm
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết nhóm:", error);
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
};

export const searchUser = async (fullname) => {
  try {
    const response = await axios.get(`${API_URL_LOCAL}/search-user`, {
      params: { fullname },
    });
    return response.data; // Trả về danh sách người dùng
  } catch (error) {
    console.error("Lỗi khi tìm kiếm người dùng:", error);
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
};


export const addMember = async (groupId, userId) => {
  try {
    const response = await axios.post(`${API_URL_LOCAL}/add-member`, {
      group_id: groupId,
      user_id: userId,
    });
    return response.data; // Trả về phản hồi từ server
  } catch (error) {
    console.error('Lỗi khi thêm thành viên:', error.response.data.message);
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
};

export const updateMemberAmount = async (groupId, userId, memberAmount, updateBy) => {
  try {
    const response = await axios.put(`${API_URL_LOCAL}/update-member-amount`, {
      group_id: groupId,
      user_id: userId,
      member_amount: memberAmount,
      update_by: updateBy, // Tên trường phù hợp với backend
    });
    return response.data;
  } catch (error) {
    // Kiểm tra lỗi từ phản hồi backend
    if (error.response && error.response.data) {
      const backendMessage = error.response.data.message;
      console.error('Lỗi từ backend:', backendMessage);
      throw new Error(backendMessage); // Trả về thông báo lỗi từ backend
    }

    // Xử lý lỗi không phải từ phản hồi của backend
    console.error('Lỗi không xác định:', error.message);
    throw new Error('Đã xảy ra lỗi không xác định.');
  }
};

export const deleteMember = async (data) => {
  try {
    const response = await axios.delete(`${API_URL_LOCAL}/delete-member`, { data });
    return response.data; // Trả về phản hồi từ server
  } catch (error) {
    console.error('Lỗi khi xóa thành viên:', error);
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
};


