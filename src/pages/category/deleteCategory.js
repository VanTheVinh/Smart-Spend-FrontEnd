import React from 'react';
import { deleteCategory } from '~/services/categoryService';

const DeleteCategoryModal = ({ isOpen, onRequestClose, category, onDelete }) => {
  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      const response = await deleteCategory(category.id); 
      const data = await response.json(); 
      console.log('API response:', data);
      if (!response.ok) {
        throw new Error(`Error deleting category. Status: ${response.status}`);
      }
      onDelete(category.id); // Call the onDelete callback to remove the category from the list
      onRequestClose(); // Close the modal
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  <div className="bg-white rounded-xl shadow-lg p-11 w-full max-w-sm">
    <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
      Bạn chắc chắn xóa danh mục "
      <span className="text-red-500">{category.category_name}</span>"?
    </h3>
    <div className="flex justify-between items-center gap-4">
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
      >
        OK
      </button>
      <button
        onClick={onRequestClose}
        className="bg-gray-300 text-gray-700 px-4 py-2 font-bold rounded-lg w-full hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        Hủy
      </button>
    </div>
  </div>
</div>
  );

};

export default DeleteCategoryModal;
