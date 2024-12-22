import { useEffect, useState, useContext } from 'react';
import BillList from '.';
import { AppContext } from '~/contexts/appContext';
import { getUserInfo } from '~/services/userService';
import BudgetUpdate from '~/components/user/BudgetUpdate';

const UserBill = () => {
  const { userId } = useContext(AppContext);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm gọi API để lấy thông tin ngân sách
  const fetchUserInfo = async () => {
    try {
      const data = await getUserInfo(userId);
      setBudget(data.budget);
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
        {/* Sử dụng BudgetUpdate component */}
        <BudgetUpdate
          userId={userId}
          currentBudget={budget}
          onUpdateSuccess={(newBudget) => setBudget(newBudget)}
        />

      {/* Truyền reloadBudget xuống BillList */}
      <BillList userId={userId} onActionComplete={reloadBudget} />
    </div>
  );
};

export default UserBill;
