import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const DeleteBillModal = ({ isOpen, onRequestClose, billToDelete, onBillDeleted }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/delete-bill/${billToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json(); // If the response is JSON, log it
      console.log('API response:', data);

      if (response.ok) {
        onBillDeleted(billToDelete.id); // Notify parent component about the deleted bill
        onRequestClose(); // Close modal
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error during delete request:', error);
      alert(`Network error: ${error.message}`);
    }
  };

  if (!billToDelete) return null;

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="overlay">
      <div>
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete the bill for "{billToDelete.description}"?</p>
        <button onClick={handleDelete}>Yes</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default DeleteBillModal;
