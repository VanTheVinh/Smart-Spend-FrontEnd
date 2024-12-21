import { useState } from 'react';
import { updateUser } from '~/services/userService';

const BudgetUpdate = ({ userId, currentBudget, onUpdateSuccess }) => {
  const [newBudget, setNewBudget] = useState(currentBudget); // Trạng thái ngân sách mới
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa

  // Hàm xử lý cập nhật ngân sách
  const handleUpdateBudget = async () => {
    try {
      const response = await updateUser(userId, { budget: newBudget });
      if (response.status === 'success') {
        onUpdateSuccess(newBudget); // Gọi callback khi cập nhật thành công
        setIsEditing(false); // Thoát chế độ chỉnh sửa
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
    <div className="bg-white flex justify-center p-4 rounded-lg shadow-md mt-6 mb-3"
    style={{ width: '500px' }}
    >
      <div className="flex items-center space-x-4">
        <h3 className='font-bold'>
          Ngân sách của bạn:{" "}
          {isEditing ? (
            <input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
              style={{ width: "150px" }} // Giữ kích thước cố định để tránh giao diện bị thay đổi
            />
          ) : (
            formatCurrency(currentBudget)
          )}
        </h3>
        {isEditing ? (
          <>
            <button
              className="bg-tealCustom hover:bg-teal-600 font-bold text-white px-4 py-2 rounded mr-2"
              onClick={handleUpdateBudget}
            >
              Lưu
            </button>
            <button
              className="bg-gray-500 font-bold text-white px-4 py-2 rounded"
              onClick={() => {
                setIsEditing(false); // Thoát chế độ chỉnh sửa
                setNewBudget(currentBudget); // Khôi phục giá trị ban đầu
              }}
            >
              Hủy
            </button>
          </>
        ) : (
          <button
            className="text-tealCustom px-4 py-2 rounded"
            onClick={() => setIsEditing(true)}
          >
            <i className="fa-solid fa-pen"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default BudgetUpdate;
