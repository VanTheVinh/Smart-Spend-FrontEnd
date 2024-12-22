// categoryService.js

import axios from 'axios';

const API_URL = 'https://smart-spend-backend-production.up.railway.app'; // Địa chỉ API của bạn

// Hàm lấy danh sách danh mục từ database
export const getCategories = async (userId, categoryType) => {
  try {
    const response = await axios.get(`${API_URL}/get-categories`, {
      params: {
        user_id: userId,
        category_type: categoryType, // Thêm category_type vào params
      },
    });
    return response.data; // Trả về dữ liệu danh mục
  } catch (error) {
    console.error('Lỗi khi lấy danh mục:', error);
    throw error; // Để có thể xử lý lỗi ở nơi khác
  }
};

export const getCategoryName = async (categoryId, categories) => {
  if (!categoryId) return '!categoryId';

  const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));
  const category = categoryMap.get(categoryId);

  return category ? category.category_name : 'Unknown';
};

// Hàm lấy chi tiết danh mục theo user_id và category_id
export const getCategoryByUserIdAndCategoryId = async (userId, categoryId) => {
  try {
    const response = await axios.get(`${API_URL}/get-categories`, {
      params: {
        user_id: userId,
        category_id: categoryId, // Thêm category_id vào params
      },
    });
    return response.data; // Trả về dữ liệu danh mục
  } catch (error) {
    console.error('Lỗi khi lấy danh mục:', error);
    throw error; // Để xử lý lỗi ở nơi khác
  }
};

// Hàm lấy chi tiết danh mục theo user_id
export const getCategoryByUserId = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/get-categories`, {
        params: {
          user_id: userId,
        },
      });
      return response.data; // Trả về dữ liệu danh mục
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
      throw error; // Để xử lý lỗi ở nơi khác
    }
  };

// Hàm thêm danh mục mới
export const addCategory = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/add-category`, data);
    return response.data; // Trả về phản hồi từ server sau khi thêm
  } catch (error) {
    console.error('Lỗi khi tạo danh mục:', error);
    throw error; // Để có thể xử lý lỗi ở nơi khác
  }
};

export const updateCategory = async (categoryId, data) => {
  try {
      const response = await axios.put(`${API_URL}/update-category/${categoryId}`, data);
      return response.data; // Trả về phản hồi từ server
  } catch (error) {
      console.error("Lỗi khi cập nhật nhóm:", error);
      throw error; // Ném lỗi để xử lý ở nơi khác
  }
};

export const deleteCategory = async (data) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-category`, { data });
    return response.data; // Trả về phản hồi từ server
  } catch (error) {
    console.error('Lỗi khi xóa danh mục:', error);
    throw error;
  }
};
