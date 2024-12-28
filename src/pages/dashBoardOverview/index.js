import React, { useState, useEffect, useContext } from 'react';
import { getDashboard } from '~/services/userService';
import { AppContext } from '~/contexts/appContext';

const DashboardOverview = () => {
  const { userId } = useContext(AppContext); // Lấy userId từ context
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const params = { user_id: userId };
        const data = await getDashboard(params);
        setDashboardData(data);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu tổng quan:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  const { total_income, total_expense, balance, exceeded_categories } = dashboardData;

  return (
    <div>
      <h2>Tổng Quan Tài Chính</h2>

      <div className="dashboard-overview">
        <div className="card">
          <h3>Tổng Thu Nhập</h3>
          <p>{total_income.toLocaleString('vi-VN')} VND</p>
        </div>

        <div className="card">
          <h3>Tổng Chi Tiêu</h3>
          <p>{total_expense.toLocaleString('vi-VN')} VND</p>
        </div>

        <div className="card">
          <h3>Số Dư</h3>
          <p>{balance.toLocaleString('vi-VN')} VND</p>
        </div>
      </div>

      <div className="exceeded-categories">
        <h3>Danh Mục Vượt Ngân Sách</h3>
        {exceeded_categories.length > 0 ? (
          <ul>
            {exceeded_categories.map((category, index) => (
              <li key={index}>{category}</li>
            ))}
          </ul>
        ) : (
          <p>Không có danh mục nào vượt ngân sách.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;
