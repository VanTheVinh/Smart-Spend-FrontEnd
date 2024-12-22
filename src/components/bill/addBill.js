import React, { useState, useContext } from 'react';
import Modal from 'react-modal';
import { format, parse } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { AppContext } from '~/contexts/appContext';
import { addBill } from '~/services/billService';

Modal.setAppElement('#root');

const AddBillModal = ({ onBillAdded, groupId }) => {
  const { userId, categories, routeBill } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // console.log('Group ID on ADDBILL:', groupId);

  const [billData, setBillData] = useState({
    type: '',
    amount: '',
    date: '',
    category_id: '',
    description: '',
    user_id: parseInt(userId),
    group_id: parseInt(groupId),
  });

  const [selectedType, setSelectedType] = useState('');

  const handleDateChange = (date) => {
    const formattedDate = format(date, 'dd-MM-yyyy');
    setBillData({ ...billData, date: formattedDate });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setBillData((prev) => ({
      ...prev,
      [name]: ['category_id', 'user_id'].includes(name)
        ? parseInt(value, 10) || 0
        : name === 'amount'
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);
    setBillData((prev) => ({
      ...prev,
      type: value,
      category_id: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Bill Data:', billData);

    try {
      const result = await addBill(billData);
      console.log('Result:', result);

      onBillAdded({
        ...billData,
        id: result.id,
        amount: parseInt(billData.amount),
        group_id: routeBill === 'group' ? billData.group_id : undefined,
        category_name:
          categories.find((cat) => cat.id === billData.category_id)
            ?.category_name || 'Unknown',
      });

      alert('Bill added successfully!');
      setBillData({
        type: '',
        amount: '',
        date: '',
        category_id: '',
        description: '',
        user_id: userId,
        group_id: '',
      });

      setSelectedType('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error during fetch:', error);
      alert(`Network error: ${error.message}`);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-tealCustom text-white px-4 py-2 rounded-xl hover:bg-teal-600"
      >
        <i className="fa-solid fa-plus"></i> {/* Trash can icon */}
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal max-w-lg w-full p-9 bg-white rounded-lg shadow-xl"
        overlayClassName="overlay fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Thêm hóa đơn</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Loại hóa đơn:
            </label>
            <select
              name="type"
              value={selectedType}
              onChange={handleTypeChange}
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
              Số tiền:
            </label>
            <input
              type="number"
              name="amount"
              value={billData.amount}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Ngày:
            </label>
            <DatePicker
              selected={
                billData.date
                  ? parse(billData.date, 'dd-mm-yyyy', new Date())
                  : null
              }
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Tên danh mục:
            </label>
            <select
              name="category_id"
              value={billData.category_id}
              onChange={handleChange}
              required
              disabled={!selectedType}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Chọn danh mục</option>
              {categories
                .filter((cat) => cat.category_type === selectedType)
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Mô tả:
            </label>
            <textarea
              name="description"
              value={billData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            ></textarea>
          </div>

          {routeBill === 'group' && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Group ID:
              </label>
              <input
                type="text"
                name="group_id"
                value={billData.group_id}
                onChange={handleChange}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
              />
            </div>
          )}

          <div className="flex justify-between gap-4">
            <button
              type="submit"
              className="bg-tealCustom text-white font-bold px-6 py-2 rounded-lg hover:bg-teal-600"
            >
              Thêm hóa đơn
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

export default AddBillModal;