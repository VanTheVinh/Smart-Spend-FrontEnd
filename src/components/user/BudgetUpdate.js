import { useState, useEffect } from 'react';
import { updateUser } from '~/services/userService';
import { getUserInfo } from '~/services/userService';

const BudgetUpdate = ({ userId, currentBudget, onUpdateSuccess }) => {
  const [newBudget, setNewBudget] = useState(currentBudget); // Trạng thái ngân sách mới
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [actualBudget, setActualBuget] = useState(null);
  //const { userId } = useContext(AppContext);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async () => {
    try {
      const data = await getUserInfo(userId);
      setBudget(data.budget);
      setActualBuget(data.actual_budget);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo(); // Gọi API khi component mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ userId]);


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
    <div className='flex space-x-12 mx-28 mt-4'>
    <div className="bg-white flex justify-center p-4 rounded-xl shadow-md mt-6 mb-3"
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
              className="bg-tealCustom hover:bg-teal-600 font-bold text-white px-4 py-2 rounded"
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
            className="text-tealCustom py-2 rounded"
            onClick={() => setIsEditing(true)}
          >
            <i className="fa-solid fa-pen"></i>
          </button>
        )}
      </div>
      </div>
      <div
          className={`flex justify-center items-center p-4 rounded-xl shadow-md mt-6 mb-3 ${
            actualBudget < 0 ? 'bg-red-300' : 'bg-green-300'
          }`}
          style={{ width: '480px' }}
        >
          <h3 className='font-bold'>Ngân sách hiện tại: {formatCurrency(actualBudget)}</h3>
      </div>
      </div>
  );
};

export default BudgetUpdate;
