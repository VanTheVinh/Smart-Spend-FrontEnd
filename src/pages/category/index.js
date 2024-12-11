import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '~/contexts/appContext'; // Import AppContext nếu cần (tùy vào yêu cầu)
import Category from './addCategory';
import UpdateCategory from './updateCategory';
import DeleteCategory from './deleteCategory';
import { getCategoryByUserId } from '~/services/categoryService'; // Import hàm từ service
import BudgetUpdate from '~/components/user/BudgetUpdate';
import { getUserInfo } from '~/services/userService'; // Giả sử getUserInfo là service để lấy thông tin người dùng

const CategoryList = () => {
  const { userId, categories, setCategories } = useContext(AppContext);
  const [budget, setBudget] = useState(null); // State để lưu ngân sách
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal chỉnh sửa
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal xóa
  const [selectedCategory, setSelectedCategory] = useState(null); // Category đang chọn để sửa
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false); // Modal cập nhật ngân sách

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount) => {
    if (typeof amount === 'string') {
      amount = parseFloat(amount); // Nếu amount là chuỗi, chuyển đổi thành số
    }
    return amount.toLocaleString('vi-VN'); // Định dạng theo chuẩn Việt Nam
  };

  const fetchCategories = async () => {
    if (!userId) return; // Không thực hiện nếu userId chưa được thiết lập
    try {
      const data = await getCategoryByUserId(userId);
      setCategories(data); // Cập nhật danh sách category trong AppContext
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    if (!userId) return;
    try {
      const data = await getUserInfo(userId);
      setBudget(data.budget); // Cập nhật ngân sách
      setLoading(false); // Đã lấy xong dữ liệu
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCategories(); // Lấy danh sách category khi có userId
      fetchUserInfo(); // Lấy thông tin ngân sách khi có userId
    }
  }, [userId]);

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
    setSelectedCategory(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  const handleOpenBudgetModal = () => {
    if (budget !== null) {
      setIsBudgetModalOpen(true); // Mở modal chỉ khi ngân sách đã được tải
    }
  };

  const handleCloseBudgetModal = () => {
    setIsBudgetModalOpen(false);
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
  };

  const handleUpdateBudget = (newBudget) => {
    setBudget(newBudget); // Cập nhật ngân sách mới
    setIsBudgetModalOpen(false);
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
      <BudgetUpdate
        userId={userId}
        currentBudget={budget}
        onUpdateSuccess={(newBudget) => setBudget(newBudget)}
      />
      <Category />
      <button onClick={handleOpenBudgetModal} disabled={budget === null}>
        Update Budget
      </button>{' '}
      {/* Disable khi chưa có ngân sách */}
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
              <th>Actual Amount</th>
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
                <td>{formatCurrency(category.amount)}</td>
                <td>{formatCurrency(category.actual_amount)}</td>
                <td>{category.time_frame}</td>
                <td>
                  <button onClick={() => handleOpenUpdateModal(category)}>
                    Edit
                  </button>
                  <button onClick={() => handleOpenDeleteModal(category)}>
                    Delete
                  </button>
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
          category={selectedCategory}
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
      {/* Modal BudgetUpdate */}
      {/* {isBudgetModalOpen && budget !== null && ( // Chỉ hiển thị modal nếu ngân sách đã có */}
      {/* )} */}
    </div>
  );
};

export default CategoryList;
