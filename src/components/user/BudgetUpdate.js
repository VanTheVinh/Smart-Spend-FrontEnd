import { useState, useEffect } from 'react';
import { updateUser } from '~/services/userService';
import { getUserInfo } from '~/services/userService';

const BudgetUpdate = ({ userId, currentBudget, onUpdateSuccess }) => {
  const [newBudget, setNewBudget] = useState(currentBudget);
  const [isEditing, setIsEditing] = useState(false);
  const [actualBudget, setActualBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async () => {
    try {
      console.log('Loading user info', loading);
      
      const data = await getUserInfo(userId);
      setNewBudget(data.budget);
      setActualBudget(data.actual_budget);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleUpdateBudget = async () => {
    try {
      const response = await updateUser(userId, { budget: newBudget });
      if (response.status === 'success') {
        onUpdateSuccess(newBudget);
        setIsEditing(false);
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
    <div className="flex text-3xl">
      <div
        className={`bg-white flex flex-col justify-center p-10 rounded-xl mt-6 mb-10 ${
          actualBudget < 0 ? 'border-red-500' : 'border-green-500'
        }`}
      >
        <div className="flex items-center space-x-4 mb-4">
          <h2 className="font-bold">
            Ngân sách:{" "}
            {isEditing ? (
              <input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2"
                style={{ width: "150px" }}
              />
            ) : (
              formatCurrency(newBudget)
            )}
          </h2>
          {isEditing ? (
            <>
              <button
                className="bg-tealColor00 hover:bg-teal-600 font-bold text-white px-4 py-2 rounded"
                onClick={handleUpdateBudget}
              >
                Lưu
              </button>
              <button
                className="bg-gray-500 font-bold text-white px-4 py-2 rounded"
                onClick={() => {
                  setIsEditing(false);
                  setNewBudget(currentBudget);
                }}
              >
                Hủy
              </button>
            </>
          ) : (
            <button
              className="text-tealColor11 py-2 rounded"
              onClick={() => setIsEditing(true)}
            >
              <i className="fa-solid fa-pen"></i>
            </button>
          )}
        </div>
        <h2
          className={`font-bold ${
            actualBudget < 0 ? 'text-red-500' : 'text-green-500'
          }`}
        >
          Thực tế: {formatCurrency(actualBudget)}
        </h2>
      </div>
    </div>
  );
};

export default BudgetUpdate;
