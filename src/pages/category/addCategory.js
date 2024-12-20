import React, { useState, useContext } from 'react';
import Modal from 'react-modal';
import { AppContext } from '~/contexts/appContext';
import { format, parse } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Cấu hình mặc định cho Modal
Modal.setAppElement('#root');

const Category = () => {
  const { userId, categories, setCategories } = useContext(AppContext);

  // Tổng ngân sách cố định
  const totalBudget = 10000; // Ví dụ: 10,000 đơn vị tiền tệ

  const [categoryData, setCategoryData] = useState({
    category_type: '',
    category_name: '',
    percentage_limit: '',
    amount: '',
    time_frame: '',
    user_id: userId,
  });

  const [selectedType, setSelectedType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateChange = (date) => {
    const isoDate = format(date, 'dd-MM-yyyy');
    setCategoryData({ ...categoryData, time_frame: isoDate });
    console.log(isoDate);
  };

  const selectedDate = categoryData.time_frame
    ? parse(categoryData.time_frame, 'dd-MM-yyyy', new Date())
    : null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'percentage_limit') {
      // Khi percentage_limit thay đổi, tính lại amount
      const percentage = Math.min(Math.max(parseFloat(value) || 0, 0), 100); // Giới hạn trong khoảng 0-100
      const newAmount = (percentage / 100) * totalBudget;
      setCategoryData({
        ...categoryData,
        percentage_limit: percentage,
        amount: Math.round(newAmount),
      });
    } else if (name === 'amount') {
      // Khi amount thay đổi, tính lại percentage_limit
      const newAmount = Math.max(parseFloat(value) || 0, 0);
      const newPercentageLimit = Math.min((newAmount / totalBudget) * 100, 100);
      setCategoryData({
        ...categoryData,
        amount: newAmount,
        percentage_limit: Math.round(newPercentageLimit),
      });
    } else {
      // Xử lý các trường khác
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
      const response = await fetch('http://127.0.0.1:5000/add-category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Category added:', result);

        // Kiểm tra xem có trường category không, nếu có thì cập nhật danh sách categories
        if (result && result.category) {
          setCategories((prevCategories) => [result.category, ...prevCategories]); // Thêm category mới vào đầu
        }

        alert('Category added successfully!');
        setCategoryData({
          category_type: '',
          category_name: '',
          percentage_limit: '',
          amount: '',
          time_frame: '',
          user_id: userId,
        });
        setSelectedType('');
        setIsModalOpen(false); // Đóng modal sau khi submit thành công
      } else {
        const errorData = await response.json();
        console.error('Error adding category:', errorData);
        alert(`Error: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error submitting category:', error);
      alert(`Network error: ${error.message}`);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-teal-500 text-white px-4 py-2 rounded-xl hover:bg-teal-600 "
      >
        <i className="fa-solid fa-plus"></i>{' '}
        {/* Trash can icon */}
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal max-w-lg w-full p-9 bg-white rounded-lg shadow-xl"
        overlayClassName="overlay fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Thêm danh mục</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Chọn loại</option>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Amount */}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              style={{ width: '100%' }}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-4">
            <button
              type="submit"
              className="bg-teal-500 text-white px-6 py-2 rounded-xl hover:bg-teal-700"
            >
              Thêm danh mục
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-300 font-bold text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Đóng
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Category;
