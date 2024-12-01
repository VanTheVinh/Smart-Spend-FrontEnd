import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import { AppContext } from '~/contexts/appContext';
import { format, parse } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

Modal.setAppElement('#root');

const UpdateBillModal = ({ isOpen, onRequestClose, billToEdit, onBillUpdated }) => {
  const {userId, categories } = useContext(AppContext);
  const [billData, setBillData] = useState({
    id: '',
    type: '',
    source: '',
    amount: '',
    date: '',
    category_id: '',
    userId:'',
    description: '',
  });

  useEffect(() => {
    if (billToEdit) {
      // Initialize bill data with the selected bill's details
      setBillData({
        id: billToEdit.id,
        type: billToEdit.type,
        source: billToEdit.source,
        amount: billToEdit.amount,
        date: billToEdit.date,
        category_id: billToEdit.category_id,
        userId: userId || billToEdit.userId,
        description: billToEdit.description,
      });
    }
  }, [billToEdit, userId]);

  const handleDateChange = (date) => {
    const formattedDate = format(date, 'dd-MM-yyyy');
    setBillData({ ...billData, date: formattedDate });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillData({ ...billData, [name]: value });
    console.log(userId);
    
  };

  const handleSubmit = async (e) => {
    console.log("USERID:", userId);
    console.log(billToEdit);

    e.preventDefault();

    // Thêm userId vào billData
    //const updatedBillData = { ...billData, userId};

    try {
      const response = await fetch(`http://127.0.0.1:5000/update-bill/${billToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },  
        body: JSON.stringify(billData),
      });

      if (response.ok) {
        const updatedBill = await response.json();
        onBillUpdated(updatedBill); // Notify parent about the updated bill
        alert('Bill updated successfully!');
        onRequestClose(); // Close modal
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
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="overlay">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Bill Type:</label>
          <select name="type" value={billData.type} onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="THU">THU</option>
            <option value="CHI">CHI</option>
          </select>
        </div>

        <div>
          <label>Source:</label>
          <select name="source" value={billData.source} onChange={handleChange} required>
            <option value="">Select Source</option>
            <option value="CHUYỂN KHOẢN">CHUYỂN KHOẢN</option>
            <option value="TIỀN MẶT">TIỀN MẶT</option>
          </select>
        </div>

        <div>
          <label>Amount:</label>
          <input type="number" name="amount" value={billData.amount} onChange={handleChange} required />
        </div>

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

        <div>
          <label>Category Name:</label>
          <select name="category_id" value={billData.category_id} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Description:</label>
          <textarea name="description" value={billData.description} onChange={handleChange}></textarea>
        </div>

        <button type="submit">Update Bill</button>
        <button type="button" onClick={onRequestClose}>
          Cancel
        </button>
      </form>
    </Modal>
  );
};

export default UpdateBillModal;