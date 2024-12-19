import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '~/contexts/appContext';
import AddCategory from './addCategory';
import UpdateCategory from './updateCategory';
import DeleteCategory from './deleteCategory';
import { getCategoryByUserId } from '~/services/categoryService';
import BudgetUpdate from '~/components/user/BudgetUpdate';
import { getUserInfo } from '~/services/userService';
import '@fortawesome/fontawesome-free/css/all.min.css';

const CategoryList = () => {
  const { userId, categories, setCategories } = useContext(AppContext);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const formatCurrency = (amount) => {
    if (typeof amount === 'string') {
      amount = parseFloat(amount);
    }
    return amount.toLocaleString('vi-VN');
  };

  const fetchCategories = async () => {
    if (!userId) return;
    try {
      const data = await getCategoryByUserId(userId);
      setCategories(data);
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
      setBudget(data.budget);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCategories();
      fetchUserInfo();
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

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-10">
      <BudgetUpdate
        userId={userId}
        currentBudget={budget}
        onUpdateSuccess={(newBudget) => setBudget(newBudget)}
      />
      <h3 className="text-3xl font-bold mb-10 text-center mt-4">DANH SÁCH DANH MỤC</h3>

      <div className="ml-20 flex items-start">
        <AddCategory onCategoryAdded={fetchCategories} />
      </div>

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div className="overflow-x-auto p-11 m-9">
          <table className="min-w-full border-collapse text-center bg-white shadow-md">
            <thead>
              <tr className="text-black border-b-2 bg-tealFirsttd border-tealCustom">
                <th className="py-4 px-4">ID</th>
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4">Name</th>
                <th className="py-4 px-4">Percentage Limit</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4">Actual Amount</th>
                <th className="py-4 px-4">Time Frame</th>
                <th className="py-4 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr
                  key={category.id}
                  className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                >
                  <td className="py-4 px-4">{category.id}</td>
                  <td className="py-4 px-4">{category.category_type}</td>
                  <td className="py-4 px-4">{category.category_name}</td>
                  <td className="py-4 px-4">{category.percentage_limit}</td>
                  <td className="py-4 px-4">
                    {formatCurrency(category.amount)}
                  </td>
                  <td className="py-2 px-4">
                    {formatCurrency(category.actual_amount)}
                  </td>
                  <td className="py-2 px-4">{category.time_frame}</td>
                  <td className="py-2 px-4 relative">
                    <button
                      onClick={() => handleOpenUpdateModal(category)}
                      className="mr-6 px-2 py-1 text-tealEdit rounded-md"
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(category)}
                      className="px-2 py-1 text-red-600 rounded-md"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <UpdateCategory
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        category={selectedCategory}
      />

      <DeleteCategory
        isOpen={isDeleteModalOpen}
        onRequestClose={handleCloseDeleteModal}
        category={selectedCategory}
        onDelete={handleDeleteCategory}
      />
    </div>
  );
};

export default CategoryList;
