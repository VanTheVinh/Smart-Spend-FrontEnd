import React, { useState, useContext } from 'react';
import Modal from 'react-modal';
import { AppContext } from '~/contexts/appContext';
import { format, parse } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Cấu hình mặc định cho Modal
Modal.setAppElement('#root');

const UpdateCategory = ({ isOpen, onRequestClose, category }) => {
  const { categories, setCategories } = useContext(AppContext);

  // Khởi tạo state cho categoryData với giá trị hiện tại của category
  const [categoryData, setCategoryData] = useState({
    category_type: category?.category_type || '',
    category_name: category?.category_name || '',
    percentage_limit: category?.percentage_limit || '',
    amount: category?.amount || '',
    time_frame: category?.time_frame || '',
    user_id: category?.user_id || '',
  });

  const [selectedType, setSelectedType] = useState(category?.category_type || '');

  const categoryOptions = {
    THU: ['Ba Mẹ cho', 'Đi sự kiện', 'Pass đồ'],
    CHI: ['Ăn uống', 'Tiền trọ, điện, nước, wifi', 'Phát sinh'],
  };

  const handleDateChange = (date) => {
    const isoDate = format(date, 'dd-MM-yyyy');
    setCategoryData({ ...categoryData, time_frame: isoDate });
  };

  const selectedDate = categoryData.time_frame
    ? parse(categoryData.time_frame, 'dd-MM-yyyy', new Date())
    : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
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
      const response = await fetch(`http://127.0.0.1:5000/update-category/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Category updated:', result);

        // Cập nhật danh sách categories sau khi sửa
        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat.id === category.id ? { ...cat, ...result.category } : cat
          )
        );

        alert('Category updated successfully!');
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
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Update Category</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Category Type:</label>
          <select
            name="category_type"
            value={selectedType}
            onChange={handleCategoryTypeChange}
            required
          >
            <option value="">Select Type</option>
            <option value="THU">THU</option>
            <option value="CHI">CHI</option>
          </select>
        </div>

        <div>
          <label>Category Name:</label>
          <input
            type="text"
            name="category_name"
            value={categoryData.category_name}
            onChange={handleChange}
            required
            disabled={!selectedType}
          />
        </div>

        <div>
          <label>Percentage Limit:</label>
          <input
            type="number"
            name="percentage_limit"
            value={categoryData.percentage_limit}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={categoryData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Time Frame:</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            className="custom-datepicker"
          />
        </div>

        <button type="submit">Update Category</button>
        <button type="button" onClick={onRequestClose}>
          Cancel
        </button>
      </form>
    </Modal>
  );
};

export default UpdateCategory;