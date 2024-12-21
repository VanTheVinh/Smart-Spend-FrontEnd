import React, { useState, useContext } from 'react';
import Modal from 'react-modal';
import { format, parse } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
      const response = addBill(billData);

      if (response.ok) {
        const result = await response.json();

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
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      alert(`Network error: ${error.message}`);
    }
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Add New Bill</button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <form onSubmit={handleSubmit}>
          <div>
            <label>Bill Type:</label>
            <select
              name="type"
              value={selectedType}
              onChange={handleTypeChange}
              required
            >
              <option value="">Select Type</option>
              <option value="THU">THU</option>
              <option value="CHI">CHI</option>
            </select>
          </div>

          <div>
            <label>Amount:</label>
            <input
              type="number"
              name="amount"
              value={billData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Date:</label>
            <DatePicker
              selected={
                billData.date
                  ? parse(billData.date, 'dd-MM-yyyy', new Date())
                  : null
              }
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              className="custom-datepicker"
            />
          </div>

          <div>
            <label>Category Name:</label>
            <select
              name="category_id"
              value={billData.category_id}
              onChange={handleChange}
              required
              disabled={!selectedType}
            >
              <option value="">Select Category</option>
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
            <label>Description:</label>
            <textarea
              name="description"
              value={billData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {routeBill === 'group' && (
            <div>
              <label>Group ID:</label>
              <input
                type="text"
                name="group_id"
                value={billData.group_id}
                onChange={handleChange}
                disabled
              />
            </div>
          )}

          <button type="submit">Add Bill</button>
          <button type="button" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AddBillModal;
