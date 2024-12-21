// UserBill.js
import { useEffect, useState, useContext } from 'react';
import BillList from '.';
import { AppContext } from '~/contexts/appContext';
import { getUserInfo } from '~/services/userService';
import BudgetUpdate from '~/components/user/BudgetUpdate';

const UserBill = () => {
  const { userId } = useContext(AppContext);
  const [budget, setBudget] = useState(null);
  const [actualBudget, setActualBuget] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm gọi API để lấy thông tin ngân sách
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Hàm reload ngân sách khi có thay đổi
  const reloadBudget = () => {
    fetchUserInfo(); // Gọi lại API để lấy dữ liệu mới
  };

  if (loading) {
    return <div>Đang tải thông tin...</div>;
  }

  const formatCurrency = (budget) => {
    return Number(budget).toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div>
      <div className="flex space-x-10 mx-28">
        {/* Sử dụng BudgetUpdate component */}
        <BudgetUpdate
          userId={userId}
          currentBudget={budget}
          onUpdateSuccess={(newBudget) => setBudget(newBudget)}
        />
        <div
          className={`flex justify-center p-6 rounded-lg shadow-md mt-6 mb-3 ${
            actualBudget < 0 ? 'bg-red-300' : 'bg-green-300'
          }`}
          style={{ width: '480px' }}
        >
          <h3 className='font-bold'>Ngân sách hiện tại: {formatCurrency(actualBudget)}</h3>
        </div>
      </div>

      {/* Truyền reloadBudget xuống BillList */}
      <BillList userId={userId} onActionComplete={reloadBudget} />
    </div>
  );
};

export default UserBill;
