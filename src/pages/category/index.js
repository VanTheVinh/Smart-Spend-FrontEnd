import { AppContext } from '~/contexts/appContext';
import AddCategory from './addCategory';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import UpdateCategory from './updateCategory';
import DeleteCategory from './deleteCategory';
import { getCategoryByUserId } from '~/services/categoryService';
import { getUserInfo } from '~/services/userService';
import '@fortawesome/fontawesome-free/css/all.min.css';

const CategoryList = () => {
  const { userId } = useContext(AppContext);
  const [categories, setCategories] = useState([]);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amountSortOrder, setAmountSortOrder] = useState('default');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [totalPercentageLimit, setTotalPercentageLimit] = useState(0);

  const formatCurrency = (amount) => {
    if (typeof amount === 'string') {
      amount = parseFloat(amount);
    }
    return amount.toLocaleString('vi-VN');
  };

  const fetchCategories = useCallback(async () => {
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
  }, [userId]);

  const fetchUserInfo = useCallback(async () => {
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
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchCategories();
      fetchUserInfo();
    }
  }, [userId]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      const total = categories.reduce((acc, category) => {
        return acc + parseFloat(category.percentage_limit || 0);
      }, 0);
      setTotalPercentageLimit(total);
    }
  }, [categories]);

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

  const filteredCategories = categories
    .filter((category) =>
      filterType === 'ALL' ? true : category.type === filterType,
    )
    .sort((a, b) => {
      if (amountSortOrder === 'default') {
        return new Date(a.date) - new Date(b.date);
      }
      const amountA = a.amount;
      const amountB = b.amount;
      return amountSortOrder === 'asc' ? amountA - amountB : amountB - amountA;
    });

  const toggleAmountSortOrder = (order) => {
    setAmountSortOrder(order);
  };

  const handleUpdateCategorySuccess = async () => {
    await fetchCategories();
    handleCloseModal();
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col justify-center">
      <div className="min-h-screen">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-3xl font-bold text-center mt-3 text-tealColor11">
            DANH SÁCH DANH MỤC
          </h3>

          <div className="flex justify-between mb-4 items-center">
            <div className="flex justify-start mb-6">
              <AddCategory
                onCategoryAdded={fetchCategories}
                totalPercentageLimit={totalPercentageLimit}
              />
            </div>

            <div className="flex items-center space-x-4 text-gray-600">
              <i className="fa-solid fa-filter"></i>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="ALL">Tất cả</option>
                <option value="THU">Thu nhập</option>
                <option value="CHI">Chi tiêu</option>
              </select>
            </div>
          </div>

          {filteredCategories.length === 0 ? (
            <p className="text-center text-gray-600">Không có danh mục nào.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category, index) => (
                <div
                  key={category.id}
                  className="bg-white p-6 rounded-xl shadow-md flex flex-col"
                >
                  <div className="text-3xl font-bold text-tealColor02">
                    {category.category_name}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">{category.category_type}</div>
                  <div className="mt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Giới hạn phần trăm:</span>
                      <span className="font-semibold">{category.percentage_limit}%</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-700">Số tiền:</span>
                      <span className="font-semibold">{formatCurrency(category.amount)} đ</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-700">Số tiền thực tế:</span>
                      <span className="font-semibold">{formatCurrency(category.actual_amount)} đ</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-700">Thời gian:</span>
                      <span className="font-semibold">{category.time_frame}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-around">
                    <button
                      onClick={() => handleOpenUpdateModal(category)}
                      className="text-tealColor00 hover:text-teal-700"
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(category)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isModalOpen && (
          <UpdateCategory
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            category={selectedCategory}
            onUpdateSuccess={handleUpdateCategorySuccess}
            totalPercentageLimit={totalPercentageLimit}
          />
        )}

        {isDeleteModalOpen && (
          <DeleteCategory
            isOpen={isDeleteModalOpen}
            onRequestClose={handleCloseDeleteModal}
            category={selectedCategory}
            onDelete={handleDeleteCategory}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryList;
