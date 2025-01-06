import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { format, parse } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getUserInfo } from '~/services/userService';
import { updateCategory } from '~/services/categoryService';

// Cấu hình mặc định cho Modal
Modal.setAppElement('#root');

const UpdateCategory = ({
  isOpen,
  onRequestClose,
  category,
  onUpdateSuccess,
  totalIncomePercentageLimit,
  totalExpensePercentageLimit,
}) => {
  // const { setCategories } = useContext(AppContext);

  const [categoryData, setCategoryData] = useState({
    category_type: category?.category_type || '',
    category_name: category?.category_name || '',
    percentage_limit: category?.percentage_limit || '',
    amount: category?.amount || '',
    time_frame: category?.time_frame || '',
    user_id: category?.user_id || '',
  });

  const [selectedType, setSelectedType] = useState(category?.category_type || '');
  const [budget, setBudget] = useState(0);
  const [percentageLimitCurrent, setPercentageLimitCurrent] = useState(0);

  // Lấy thông tin người dùng
  useEffect(() => {
    setPercentageLimitCurrent(Number(categoryData.percentage_limit));
    if (category?.user_id) {
      const fetchUserBudget = async () => {
        try {
          const userInfo = await getUserInfo(category.user_id);
          setBudget(userInfo.budget);
        } catch (error) {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
          setBudget(0); // Giá trị mặc định nếu xảy ra lỗi
        }
      };

      fetchUserBudget();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category?.user_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const percentageLimit =
      categoryData.category_type === 'THU'
        ? 100 - totalIncomePercentageLimit + percentageLimitCurrent
        : 100 - totalExpensePercentageLimit + percentageLimitCurrent;

    if (name === 'percentage_limit') {
      let newPercentageLimit = Math.min(
        Math.max(parseFloat(value) || 0, 0),
        percentageLimit
      );

      const newAmount = (newPercentageLimit / 100) * budget;
      setCategoryData({
        ...categoryData,
        percentage_limit: newPercentageLimit,
        amount: Math.round(newAmount),
      });
    } else if (name === 'amount') {
      let newAmount = parseFloat(value) || 0;

      const maxAmount = (percentageLimit / 100) * budget;

      if (newAmount > maxAmount) {
        newAmount = maxAmount;
      }

      const newPercentageLimit = Math.min(
        (newAmount / budget) * 100,
        percentageLimit
      );

      setCategoryData({
        ...categoryData,
        amount: newAmount,
        percentage_limit: Math.round(newPercentageLimit),
      });
    } else {
      setCategoryData({ ...categoryData, [name]: value });
    }
  };

  const handleDateChange = (date) => {
    const isoDate = format(date, 'dd-MM-yyyy');
    setCategoryData({ ...categoryData, time_frame: isoDate });
  };

  const handleCategoryTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);
    setCategoryData((prev) => ({
      ...prev,
      category_type: value,
      category_name: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await updateCategory(category.id, categoryData);
      console.log('Submit form with:', response);
  
      // Kiểm tra chính xác theo cấu trúc API trả về
      if (response.status === 'success') {
        alert(response.message); // Hiển thị thông báo thành công từ API
        onUpdateSuccess(response.message);
        onRequestClose();
      } else {
        console.error('Update failed:', response);
        alert('Đã xảy ra lỗi khi cập nhật!');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert(`Network error: ${error.message}`);
    }
  };
  
  const selectedDate = categoryData.time_frame
    ? parse(categoryData.time_frame, 'dd-MM-yyyy', new Date())
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal max-w-lg w-full p-9 bg-white rounded-lg shadow-xl"
      overlayClassName="overlay fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-4xl font-bold text-tealColor11 mb-10 text-center">
        Cập nhật danh mục
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Loại danh mục:
          </label>
          <select
            name="category_type"
            value={selectedType}
            onChange={handleCategoryTypeChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Chọn loại</option>
            <option value="THU">THU</option>
            <option value="CHI">CHI</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Tên danh mục:
          </label>
          <input
            type="text"
            name="category_name"
            value={categoryData.category_name}
            onChange={handleChange}
            required
            disabled={!selectedType}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Giới hạn phần trăm:
          </label>
          <input
            type="number"
            name="percentage_limit"
            value={categoryData.percentage_limit}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Số tiền:
          </label>
          <input
            type="number"
            name="amount"
            value={categoryData.amount}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Time Frame:
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex justify-between gap-4">
          <button
            type="submit"
            className="bg-tealColor11 text-white px-6 py-2 rounded-xl hover:bg-teal-700"
          >
            Cập nhật danh mục
          </button>
          <button
            type="button"
            onClick={onRequestClose}
            className="bg-gray-300 font-bold text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
          >
            Đóng
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateCategory;
