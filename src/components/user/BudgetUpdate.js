import { useState } from 'react';
import { updateUser } from '~/services/userService';

const BudgetUpdate = ({ userId, currentBudget, onUpdateSuccess }) => {
  const [newBudget, setNewBudget] = useState(currentBudget); // Trạng thái ngân sách mới
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal

  // Hàm xử lý cập nhật ngân sách
  const handleUpdateBudget = async () => {
    try {
      const response = await updateUser(userId, { budget: newBudget });
      if (response.status === 'success') {
        onUpdateSuccess(newBudget); // Gọi callback khi cập nhật thành công
        setIsModalOpen(false); // Đóng modal
        alert('Ngân sách đã được cập nhật thành công');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật ngân sách:', error);
      alert('Cập nhật ngân sách thất bại');
    }
  };

  const formatCurrency = (budget) => {
    return Number(budget).toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="bg-white p-8 flex items-center rounded-lg shadow-md mb-6">
      <div className="flex items-center space-x-4">
      <h3 >Ngân sách của bạn: {formatCurrency(currentBudget)}</h3>
      <button
        className="text-tealCustom px-4 py-2 rounded"
        onClick={() => setIsModalOpen(true)}
      >
        <i className="fa-solid fa-pen"></i>
      </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-9 rounded-lg shadow-lg w-96">
            <h4 className="text-2xl text-center font-bold mb-4">Cập nhật ngân sách</h4>
              <input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-full mt-2"
              />
            <div className="flex justify-end mt-4">
              <button
                className="bg-tealCustom hover:bg-teal-600 font-bold text-white px-4 py-2 rounded mr-2"
                onClick={handleUpdateBudget}
              >
                Lưu
              </button>
              <button
                className="bg-gray-500 font-bold text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetUpdate;
