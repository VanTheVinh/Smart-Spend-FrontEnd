import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import { AppContext } from '~/contexts/appContext';
import { format, parse } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { getUserInfo } from '~/services/userService';

// Cấu hình mặc định cho Modal
Modal.setAppElement('#root');

const UpdateCategory = ({
  isOpen,
  onRequestClose,
  category,
  onUpdateSuccess,
  totalPercentageLimit,
}) => {
  const { setCategories } = useContext(AppContext);

  const [categoryData, setCategoryData] = useState({
    category_type: category?.category_type || '',
    category_name: category?.category_name || '',
    percentage_limit: category?.percentage_limit || '',
    amount: category?.amount || '',
    time_frame: category?.time_frame || '',
    user_id: category?.user_id || '',
  });

  const [selectedType, setSelectedType] = useState(
    category?.category_type || '',
  );
  const [budget, setBudget] = useState(0);
  const [percentageLimitCurrent, setPercentageLimitCurrent] = useState(0);
  

  // Lấy thông tin người dùng
  useEffect(() => {
    setPercentageLimitCurrent(Number(categoryData.percentage_limit));
    if (category?.user_id) {
      const fetchUserBudget = async () => {
        try {
          const userInfo = await getUserInfo(category.user_id);
          setBudget(userInfo.budget); // Lấy `budget` từ userInfo
        } catch (error) {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
          setBudget(0); // Mặc định nếu có lỗi
        }
      };

      fetchUserBudget();
    }
  }, [category?.user_id]);

  const formatCurrency = (amount) => {
    if (typeof amount === 'string') {
      amount = parseFloat(amount); // Nếu amount là chuỗi, chuyển đổi thành số
    }
    return amount.toLocaleString('vi-VN'); // Định dạng theo chuẩn Việt Nam
  };

  const handleDateChange = (date) => {
    const isoDate = format(date, 'dd-MM-yyyy');
    setCategoryData({ ...categoryData, time_frame: isoDate });
  };

  const selectedDate = categoryData.time_frame
    ? parse(categoryData.time_frame, 'dd-MM-yyyy', new Date())
    : null;

  const handleChange = (e) => {
    // console.log('totalPercentageLimit: ', totalPercentageLimit);
    // console.log('totalPercentageLimit current: ', percentageLimitCurrent);

    const { name, value } = e.target;

    const percentageLimit = 100 - totalPercentageLimit + percentageLimitCurrent;

    if (name === 'percentage_limit') {
      let newPercentageLimit = Math.min(
        Math.max(parseFloat(value) || 0, 0), percentageLimit,
      ); // Giới hạn tối đa là 100
      const newAmount = (newPercentageLimit / 100) * budget; // Tính toán amount dựa trên `budget`
      setCategoryData({
        ...categoryData,
        percentage_limit: newPercentageLimit,
        amount: Math.round(newAmount),
      });
    } else if (name === 'amount') {
      let newAmount = parseFloat(value) || 0;

      // Tính toán giới hạn của amount dựa trên totalPercentageLimit
      const maxAmount = (percentageLimit / 100) * budget;

      // Đảm bảo amount không vượt quá giới hạn maxAmount
      if (newAmount > maxAmount) {
        newAmount = maxAmount; // Giới hạn amount không vượt quá maxAmount
      }

      const newPercentageLimit = Math.min(
        (newAmount / budget) * 100,
        percentageLimit,
      ); // Tính percentage_limit và giới hạn không quá 100

      setCategoryData({
        ...categoryData,
        amount: newAmount, // Cập nhật amount với giá trị không vượt quá giới hạn
        percentage_limit: Math.round(newPercentageLimit),
      });
    } else {
      setCategoryData({ ...categoryData, [name]: value });
    }
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
      const response = await fetch(
        `http://127.0.0.1:5000/update-category/${category.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryData),
        },
      );

      console.log('Response:', response);

      if (response.ok) {
        const result = await response.json();
        console.log('Category updated:', result);

        // Cập nhật danh sách categories sau khi sửa
        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat.id === category.id ? { ...cat, ...result.category } : cat,
          ),
        );

        alert('Cập nhật danh mục thành công!');
        onUpdateSuccess(); // Gọi hàm callback để cập nhật lại danh sách categories
        onRequestClose(); // Đóng modal sau khi submit thành công
      } else {
        const errorData = await response.json();
        console.error('Error updating category:', errorData);
        alert(`Error: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error submitting update:', error);
      alert(`Network error: ${error.message}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Update Category"
      className="modal max-w-lg w-full p-9 bg-white rounded-xl shadow-lg"
      overlayClassName="overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Cập nhật danh mục
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Type */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Loại danh mục:
          </label>
          <select
            name="category_type"
            value={selectedType}
            onChange={handleCategoryTypeChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tealCustom"
          >
            <option value="THU">THU</option>
            <option value="CHI">CHI</option>
          </select>
        </div>

        {/* Category Name */}
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tealCustom"
          />
        </div>

        {/* Percentage Limit */}
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tealCustom"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Amount:
          </label>
          <input
            type="number"
            name="amount"
            value={categoryData.amount}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tealCustom"
          />
        </div>

        {/* Time Frame */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Time Frame:
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tealCustom"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-4 mt-4">
          <button
            type="submit"
            className="bg-teal-500 mt-3 text-white px-6 py-2 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
          >
            Cập nhật
          </button>
          <button
            type="button"
            onClick={onRequestClose}
            className="bg-gray-300 mt-3 text-gray-700 font-bold px-6 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 w-full"
          >
            Đóng
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateCategory;
