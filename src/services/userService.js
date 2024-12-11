import axios from 'axios';
const API_URL = 'http://localhost:5000'; // Địa chỉ API của bạn

export const getUserInfo = async (userId) => {
    try {        
        const response = await axios.get(`${API_URL}/get-user/${userId}`); // Sửa URL endpoint ở đây
        console.log('Data:', response.data);
        
        return response.data; // Trả về thông tin người dùng
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        throw error; // Ném lỗi để xử lý ở nơi khác
    }
};

export const updateUser = async (userId, data) => {
    try {        
        const response = await axios.put(`${API_URL}/update-user/${userId}`, data); // Sửa URL endpoint ở đây
        // console.log('Data:', response.data);
        return response.data; // Trả về thông tin người dùng
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        throw error; // Ném lỗi để xử lý ở nơi khác
    }
};
