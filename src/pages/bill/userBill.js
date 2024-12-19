// UserBill.js
import { useEffect, useState, useContext } from 'react';
import BillList from '.';
import { AppContext } from '~/contexts/appContext';
import { getUserInfo } from '~/services/userService';
import BudgetUpdate from '~/components/user/BudgetUpdate';

const UserBill = () => {
  const { userId } = useContext(AppContext);
  const [budget, setBudget] = useState(null); // Trạng thái lưu trữ ngân sách
  const [loading, setLoading] = useState(true); // Trạng thái loading

  useEffect(() => {
    // Gọi API để lấy thông tin người dùng, bao gồm ngân sách
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo(userId); // Giả sử getUserInfo lấy thông tin ngân sách
        setBudget(data.budget); // Cập nhật ngân sách từ API
        setLoading(false); // Đã lấy xong dữ liệu
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        setLoading(false);
      }
    };

    fetchUserInfo(); // Gọi API trong useEffect
  }, [userId]); // Chỉ chạy 1 lần khi component mount

  if (loading) {
    return <div>Đang tải thông tin...</div>;
  }

  return (
    <div>
      <h2>User Bill</h2>
      
      {/* Sử dụng BudgetUpdate component */}
      <BudgetUpdate 
        userId={userId} 
        currentBudget={budget} 
        onUpdateSuccess={(newBudget) => setBudget(newBudget)} 
      />
      
      <BillList userId={userId} />
    </div>
  );
};

export default UserBill;
