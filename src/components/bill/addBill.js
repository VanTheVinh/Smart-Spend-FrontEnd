import React, { useState, useContext } from 'react';
import Modal from 'react-modal';
import { AppContext } from '~/contexts/appContext';
import { format, parse } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

Modal.setAppElement('#root');

const AddBillModal = ({ onBillAdded }) => {
  const { userId, categories } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billData, setBillData] = useState({
    type: '',
    source: '',
    amount: '',
    date: '',
    category_id: '',
    description: '',
    user_id: userId,
  });
  
  const [selectedType, setSelectedType] = useState('');

  // Handle Date change for date
  const handleDateChange = (date) => {
    const formattedDate = format(date, 'dd-MM-yyyy');
    setBillData({ ...billData, date: formattedDate });
  };

  // Handle other form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillData({ ...billData, [name]: value });
  };

  // Handle Bill Type selection
  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);
    setBillData((prev) => ({
      ...prev,
      type: value,
      category_id: '', // Reset category when bill type changes
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`http://127.0.0.1:5000/add-bill`, 
        {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(billData),
      });
  
      if (response.ok) {
        const result = await response.json();
      
        onBillAdded({
          ...billData,
          id: result.id, // Thêm ID từ kết quả API
          category_name: categories.find((cat) => cat.id === billData.category_id)?.category_name || 'Unknown',
        });
        
        alert('Bill added successfully!');
        // Reset form và đóng modal
        setBillData({
          type: '',
          source: '',
          amount: '',
          date: '',
          category_id: '',
          description: '',
          user_id: userId,
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

  console.log(billData);

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
            <label>Source:</label>
            <select
              name="source"
              value={billData.source}
              onChange={handleChange}
              required
            >
              <option value="">Select Source</option>
              <option value="CHUYỂN KHOẢN">CHUYỂN KHOẢN</option>
              <option value="TIỀN MẶT">TIỀN MẶT</option>
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

          {/* Date DatePicker */}
          <div>
            <label>Date:</label>
            <DatePicker
              selected={billData.date ? parse(billData.date, 'dd-MM-yyyy', new Date()) : null}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              className="custom-datepicker"
            />
          </div>

          {/* Category selection based on bill type */}
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
