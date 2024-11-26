import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '~/contexts/appContext';
import Category from './addCategory';
import UpdateCategory from './updateCategory';
import DeleteCategory from './deleteCategory';

const CategoryList = () => {
  const { userId, categories, setCategories } = useContext(AppContext); // Kết hợp từ AppContext
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Khai báo state cho Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
  const [selectedCategory, setSelectedCategory] = useState(null); // Category đang chọn để sửa

  const fetchCategories = async () => {
    if (!userId) return; // Không thực hiện nếu userId chưa được thiết lập
    try {
      const response = await fetch(`http://127.0.0.1:5000/get-categories?user_id=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data); // Cập nhật danh sách category trong AppContext
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [userId, categories]); // Gọi lại khi userId thay đổi

  const handleOpenUpdateModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null); // Xóa dữ liệu category khi đóng modal
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter((category) => category.id !== categoryId)); // Remove the deleted category from the list
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Category List</h2>
      <Category />

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Percentage Limit</th>
              <th>Amount</th>
              <th>Time Frame</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.category_type}</td>
                <td>{category.category_name}</td>
                <td>{category.percentage_limit}</td>
                <td>{category.amount}</td>
                <td>{category.time_frame}</td>
                <td>
                <button onClick={() => handleOpenUpdateModal(category)}>Edit</button>
                <button onClick={() => handleOpenDeleteModal(category)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
             )}
             {/* Modal UpdateCategory */}
             {isModalOpen && (
               <UpdateCategory
                 isOpen={isModalOpen}
                 onRequestClose={handleCloseModal}
                 category={selectedCategory} // Truyền category được chọn
               />
              )}

              {/* Modal DeleteCategory */}
              {isDeleteModalOpen && (
                <DeleteCategory
                  isOpen={isDeleteModalOpen}
                  onRequestClose={handleCloseDeleteModal}
                  category={selectedCategory}
                  onDelete={handleDeleteCategory}
                />
      )}
    </div>
  );
};

export default CategoryList;
