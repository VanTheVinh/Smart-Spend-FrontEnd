import React, { useState, useEffect } from 'react';
import { checkSpendAlerts } from '~/services/alertService';

const SpendAlerts = ({ userId }) => {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await checkSpendAlerts(userId);
        if (data && data.length > 0) {
          setAlerts(data);
        } else {
          setAlerts([]);
        }
      } catch (err) {
        setError('Không thể lấy dữ liệu cảnh báo chi tiêu.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [userId]);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Cảnh báo chi tiêu</h2>
      {alerts.length > 0 ? (
        <ul>
          {alerts.map((alert, index) => (
            <li key={index}>
              <strong>{alert.category_name}:</strong> {alert.message} (Ngày: {alert.date})
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có cảnh báo chi tiêu nào.</p>
      )}
    </div>
  );
};

export default SpendAlerts;
