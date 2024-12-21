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
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal max-w-lg w-full p-9 bg-white rounded-xl shadow-xl"
      overlayClassName="overlay fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
    >
      <p className="text-gray-700 text-center mb-6">
        Bạn chắc chắn muốn xóa hóa đơn không?
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          OK
        </button>
        <button
          onClick={onRequestClose}
          className="bg-gray-300 font-bold text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          Hủy
        </button>
      </div>
    </Modal>
  );
};

export default DeleteBillModal;
