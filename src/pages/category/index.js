import { AppContext } from '~/contexts/appContext';
import AddCategory from './addCategory';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Category from './addCategory';
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
  const [amountSortOrder, setAmountSortOrder] = useState('default');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterType, setFilterType] = useState(''); // State để lưu loại lọc (THU hoặc CHI)
  const [totalPercentageLimit, setTotalPercentageLimit] = useState(0); // State lưu tổng percentage_limit

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
      setCategories(data); // Chỉ cần setCategories, không cần đưa vào dependencies array
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error.message);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // Dependency là userId, không cần thêm setCategories

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
  }, [userId]); // Dependency là userId

  useEffect(() => {
    if (userId) {
      fetchCategories();
      fetchUserInfo();
    }
  }, [userId, fetchCategories, fetchUserInfo]);

  // Tính tổng percentage_limit mỗi khi categories thay đổi
  useEffect(() => {
    if (categories && categories.length > 0) {
      const total = categories.reduce((acc, category) => {
        // Chuyển đổi percentage_limit sang số (nếu nó là chuỗi) trước khi cộng
        return acc + parseFloat(category.percentage_limit || 0);
      }, 0); // Khởi tạo với 0
      setTotalPercentageLimit(total);
    }
    console.log('Categories:', categories);
    // console.log('Total percentage limit:', totalPercentageLimit);
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

  // Hàm lọc danh sách category theo type (THU hoặc CHI)
  const filteredCategories = categories
    .filter((category) =>
      filterType === 'ALL' ? true : category.type === filterType,
    )
    .sort((a, b) => {
      if (amountSortOrder === 'default') {
        return new Date(a.date) - new Date(b.date); // Sắp xếp theo ngày nếu là mặc định
      }
      const amountA = a.amount;
      const amountB = b.amount;
      return amountSortOrder === 'asc' ? amountA - amountB : amountB - amountA;
    });
  console.log(categories);

  const toggleAmountSortOrder = (order) => {
    setAmountSortOrder(order);
  };

  const handleUpdateCategorySuccess = async () => {
    await fetchCategories(); // Cập nhật lại danh sách categories
    handleCloseModal(); // Đóng modal sau khi cập nhật thành công
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col justify-center mx-20">
      <div className="p-10 min-h-screen">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-3xl font-bold text-center mt-3">
            DANH SÁCH DANH MỤC
          </h3>

          <div className="flex justify-between mb-4">
            <div className="flex justify-start mb-6">
              <AddCategory onCategoryAdded={fetchCategories} />
            </div>

            {/* Dropdown lọc theo type */}
            <div className="my-4 space-x-4 text-gray-600">
              <i class="fa-solid fa-filter"></i>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="ALL">Tất cả</option>
                <option value="THU">Thu nhập</option>
                <option value="CHI">Chi tiêu</option>
              </select>
            </div>
          </div>

          {filteredCategories.length === 0 ? (
            <p className="text-center text-gray-600">No categories found.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow-lg">
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
                      className={index % 2 === 1 ? 'bg-tdOdd' : 'bg-white'}
                    >
                      <td className="py-4 px-4">{category.id}</td>
                      <td className="py-4 px-4">{category.category_type}</td>
                      <td className="py-4 px-4">{category.category_name}</td>
                      <td className="py-4 px-4">{category.percentage_limit}</td>
                      <td className="py-4 px-4">
                        {formatCurrency(category.amount)}
                      </td>
                      <td className="py-4 px-4">
                        {formatCurrency(category.actual_amount)}
                      </td>
                      <td className="py-4 px-4">{category.time_frame}</td>
                      <td className="py-4 px-4 relative">
                        <button
                          onClick={() => handleOpenUpdateModal(category)}
                          className="mr-6 px-2 py-1 text-tealEdit"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(category)}
                          className="px-2 py-1 text-red-600"
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
        </div>

        {/* Modal UpdateCategory */}
        {isModalOpen && (
          <UpdateCategory
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            category={selectedCategory}
            onUpdateSuccess={handleUpdateCategorySuccess}
            totalPercentageLimit={totalPercentageLimit}
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
    </div>
  );
};

export default CategoryList;
