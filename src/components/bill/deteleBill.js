import React from 'react';
import Modal from 'react-modal';
import { deleteBill } from '~/services/billService';

const DeleteBillModal = ({
  isOpen,
  onRequestClose,
  billToDelete,
  onBillDeleted,
}) => {
  const handleDelete = async () => {
    if (billToDelete) {
      try {
        await deleteBill(billToDelete.id);
        onBillDeleted(billToDelete.id);
      } catch (error) {
        console.error('Error deleting bill:', error);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Delete Bill"
      className="relative bg-white rounded-lg p-6 w-full max-w-md mx-auto z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
    >
      <h2 className="text-xl font-bold text-center mb-4">Xóa Hóa Đơn</h2>
      <div className="text-center">
        <p>Bạn có chắc chắn muốn xóa hóa đơn này?</p>
        <div className="mt-4">
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
          >
            Xóa
          </button>
          <button
            onClick={onRequestClose}
            className="ml-4 py-2 px-4 rounded-lg bg-gray-300 hover:bg-gray-400"
          >
            Hủy
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteBillModal;
