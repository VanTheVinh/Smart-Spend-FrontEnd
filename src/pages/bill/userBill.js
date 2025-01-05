import { useEffect, useState, useContext } from 'react';
import BillList from '.';
import { AppContext } from '~/contexts/appContext';
import { getUserInfo } from '~/services/userService';
import BudgetUpdate from '~/components/user/BudgetUpdate';
import BillReport from '~/components/bill/billReport';

const UserBill = () => {
  const { userId } = useContext(AppContext);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  // State cho tháng/năm và loại
  const [selectedDate, setSelectedDate] = useState('2024-12'); // Mặc định mm/yyyy
  const [type, setType] = useState('ALL'); // Mặc định là "Tất cả"

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
  }, [userId]);

  // Hàm reload ngân sách khi có thay đổi
  const reloadBudget = () => {
    fetchUserInfo(); // Gọi lại API để lấy dữ liệu mới
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold">Đang tải thông tin...</div>
      </div>
    );
  }

  // Tách tháng và năm từ selectedDate
  const [year, month] = selectedDate.split('-').map(Number);

  return (
    <div className="px-14 pt-4 bg-gray-100">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-8 text-tealColor11">
        QUẢN LÝ HÓA ĐƠN
      </h1>

      {/* Ngân sách và báo cáo */}
      <div className="grid gap-4 md:grid-cols-2 mb-4">
        <div className="bg-white shadow rounded-lg pl-56 pt-10 border-b-4 border-teal-500">
          <BudgetUpdate
            userId={userId}
            currentBudget={budget}
            onUpdateSuccess={(newBudget) => setBudget(newBudget)}
          />
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <BillReport month={month} year={year} type={type} userId={userId} />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Bộ lọc tháng/năm và loại (đẩy sang phải) */}
          <div className="flex ml-auto gap-4">
            <div>
              <label className="font-semibold">Tháng/Năm:</label>
              <input
                type="month"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 ml-2"
              />
            </div>
            <div>
              <label className="font-semibold">Loại:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 ml-2"
              >
                <option value="ALL">Tất cả</option>
                <option value="CHI">Chi tiêu</option>
                <option value="THU">Thu nhập</option>
              </select>
            </div>

            {/* <div className="my-4 space-x-4 text-gray-600">

              <i className="fa-solid fa-filter-circle-dollar"></i>
              <select
                value={amountSortOrder}
                onChange={(e) => toggleAmountSortOrder(e.target.value)}
              >
                <option value="default">Mặc định</option>
                <option value="asc">Tăng dần</option>
                <option value="desc">Giảm dần</option>
              </select>
            </div> */}
          </div>
        </div>

        {/* Danh sách hóa đơn */}
        <BillList
          userId={userId}
          onActionComplete={reloadBudget}
          month={month}
          year={year}
          type={type}
        />
      </div>
    </div>
  );
};

export default UserBill;
