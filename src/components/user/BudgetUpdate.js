import { useState, useEffect } from 'react';
import { updateUser } from '~/services/userService';

const BudgetUpdate = ({ userId, currentBudget, onUpdateSuccess }) => {
  const [newBudget, setNewBudget] = useState(currentBudget); // Trạng thái ngân sách mới
  const [isEditing, setIsEditing] = useState(false); // Trạng thái cho phép chỉnh sửa ngân sách

  // Đồng bộ newBudget với currentBudget khi chuyển sang chế độ chỉnh sửa
  useEffect(() => {
    if (isEditing) {
      setNewBudget(currentBudget); // Cập nhật giá trị mới cho input
    }
  }, [isEditing, currentBudget]);

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

  const formatCurrency = (budget) => {
    return Number(budget).toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div>
      <h3>Ngân sách của bạn: {formatCurrency(currentBudget)}</h3>
      
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
