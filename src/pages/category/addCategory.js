import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import { format, parse } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { AppContext } from '~/contexts/appContext';
import { addCategory } from '~/services/categoryService';
import { getUserInfo } from '~/services/userService';

// Cấu hình mặc định cho Modal
Modal.setAppElement('#root');

const AddCategory = ({ totalIncomePercentageLimit, totalExpensePercentageLimit }) => {
  const { userId, setCategories } = useContext(AppContext);

  // Tổng ngân sách cố định
  // const totalBudget = 10000; // Ví dụ: 10,000 đơn vị tiền tệ

  const [categoryData, setCategoryData] = useState({
    category_type: '',
    category_name: '',
    percentage_limit: '',
    amount: '',
    time_frame: '',
    user_id: userId,
  });

  const [percentageLimitCurrent, setPercentageLimitCurrent] = useState(0);
  const [selectedType, setSelectedType] = useState('');
  const [budget, setBudget] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // console.log('Total percentage limit:', totalPercentageLimit);
    
    setPercentageLimitCurrent(0);

    const fetchUserBudget = async () => {
      try {
        const userInfo = await getUserInfo(userId);
        setBudget(userInfo.budget); // Lấy `budget` từ userInfo
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        setBudget(0); // Mặc định nếu có lỗi
      }
    };

    fetchUserBudget();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDateChange = (date) => {
    const isoDate = format(date, 'dd-MM-yyyy');
    setCategoryData({ ...categoryData, time_frame: isoDate });
    // console.log(isoDate);
  };

  const selectedDate = categoryData.time_frame
    ? parse(categoryData.time_frame, 'dd-MM-yyyy', new Date())
    : null;

    const handleChange = (e) => {
      const { name, value } = e.target;
    
      console.log('budget:', budget);
    
      // Kiểm tra category_type để chọn đúng giới hạn phần trăm
      const percentageLimit = categoryData.category_type === 'THU'
        ? 100 - totalIncomePercentageLimit + percentageLimitCurrent  // Giới hạn cho THU
        : 100 - totalExpensePercentageLimit + percentageLimitCurrent; // Giới hạn cho CHI
    
      if (name === 'percentage_limit') {
        let newPercentageLimit = Math.min(
          Math.max(parseFloat(value) || 0, 0),
          percentageLimit,
        ); // Giới hạn giá trị từ 0 đến `percentageLimit`
    
        const newAmount = (newPercentageLimit / 100) * budget; // Tính toán amount dựa trên `budget`
        setCategoryData({
          ...categoryData,
          percentage_limit: newPercentageLimit,
          amount: Math.round(newAmount),
        });
      } else if (name === 'amount') {
        let newAmount = parseFloat(value) || 0;
    
        // Tính toán giới hạn của amount dựa trên totalIncomePercentageLimit hoặc totalExpensePercentageLimit
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
    console.log('Submitting category:', categoryData);  // In ra categoryData
    try {
      const response = await addCategory(categoryData);
      // Kiểm tra xem có trường category không, nếu có thì cập nhật danh sách categories
      if (response && response.category) {
        setCategories((prevCategories) => [
          response.category,
          ...prevCategories,
        ]); // Thêm category mới vào đầu
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
        <i className="fa-solid fa-plus"></i> {/* Trash can icon */}
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal max-w-lg w-full p-9 bg-white rounded-lg shadow-xl"
        overlayClassName="overlay fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-4xl font-bold text-tealColor11 mb-10 text-center">
          Thêm danh mục
        </h2>
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
              className="bg-tealColor11 text-white px-6 py-2 rounded-xl hover:bg-teal-700"
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

export default AddCategory;
