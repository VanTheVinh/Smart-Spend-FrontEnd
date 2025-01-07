import React from 'react';
import Modal from 'react-modal';
import { deleteGroup } from '~/services/groupService';

const DeleteGroupModal = ({
  isOpen,
  onRequestClose,
  groupToDelete,
  onGroupDeleted,
}) => {
  const handleDelete = async () => {
    if (groupToDelete) {
      try {
        await deleteGroup(groupToDelete.id);
        onGroupDeleted(groupToDelete.id);
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Delete Group"
      className="relative bg-white rounded-lg p-6 w-full max-w-md mx-auto z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
    >
      <h2 className="text-xl font-bold text-center mb-4">Xóa Nhóm</h2>
      <div className="text-center">
        <p>Bạn có chắc chắn muốn xóa nhóm này?</p>
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

export default DeleteGroupModal;
