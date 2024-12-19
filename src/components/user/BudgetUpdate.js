// BudgetUpdate.js
import { useState } from 'react';
import { updateUser } from '~/services/userService';

const BudgetUpdate = ({ userId, currentBudget, onUpdateSuccess }) => {
  const [newBudget, setNewBudget] = useState(currentBudget); // Trạng thái ngân sách mới
  const [isEditing, setIsEditing] = useState(false); // Trạng thái cho phép chỉnh sửa ngân sách

  // Hàm cập nhật ngân sách mới
  const handleUpdateBudget = async () => {
    try {
      const response = await updateUser(userId, { budget: newBudget });
      if (response.status === 'success') {
        onUpdateSuccess(newBudget); // Gọi callback khi cập nhật thành công
        setIsEditing(false); // Đặt lại trạng thái là không chỉnh sửa
        alert('Ngân sách đã được cập nhật thành công');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật ngân sách:', error);
      alert('Cập nhật ngân sách thất bại');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3>Ngân sách của bạn: {currentBudget}</h3>
      
      {/* Nếu đang chỉnh sửa, hiển thị ô input */}
      {isEditing ? (
        <div>
          <label>
            Cập nhật ngân sách:
            <input 
              type="number" 
              value={newBudget} 
              onChange={(e) => setNewBudget(e.target.value)} 
            />
          </label>
          <button onClick={handleUpdateBudget}>Cập nhật ngân sách</button>
          <button onClick={() => setIsEditing(false)}>Hủy</button>
        </div>
      ) : (
        <div>
          <button onClick={() => setIsEditing(true)}>Chỉnh sửa ngân sách</button>
        </div>
      )}
    </div>
  );
};

export default BudgetUpdate;
