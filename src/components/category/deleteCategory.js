import React from 'react';

const DeleteCategoryModal = ({ isOpen, onRequestClose, category, onDelete }) => {
  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/delete-category/${category.id}`, {
        method: 'DELETE',
      });
      const data = await response.json(); // If the response is JSON, log it
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
    <div className="modal">
      <div className="modal-content">
        <h3>Are you sure you want to delete the category "{category.category_name}"?</h3>
        <button onClick={handleDelete}>Yes</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </div>
  );

};

export default DeleteCategoryModal;
