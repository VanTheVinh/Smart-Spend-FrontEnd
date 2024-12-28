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
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="text-xl font-bold text-center mb-4">Xóa Hóa Đơn</h2>
      <div className="text-center">
        <p>Bạn có chắc chắn muốn xóa hóa đơn này?</p>
        <div className="mt-4">
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white py-2 px-4 rounded-lg"
          >
            Xóa
          </button>
          <button
            onClick={onRequestClose}
            className="ml-4 py-2 px-4 rounded-lg bg-gray-300"
          >
            Hủy
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteBillModal;
