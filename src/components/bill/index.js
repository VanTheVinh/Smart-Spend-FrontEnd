import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '~/contexts/appContext';

const BillList = () => {
  const { userId } = useContext(AppContext); // Lấy userId từ AppContext
  const [bills, setBills] = useState([]); // State để lưu danh sách bills
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm fetch bills từ API
  const fetchBills = async () => {
    if (!userId) return; // Không thực hiện nếu userId chưa được thiết lập
    try {
      const response = await fetch(`http://127.0.0.1:5000/get-bills?user_id=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setBills(data); // Cập nhật danh sách bills
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bills:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Fetch bills khi component mount hoặc userId thay đổi
  useEffect(() => {
    fetchBills();
  }, [userId]);

  if (loading) {
    return <div>Loading bills...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Bill List</h2>

      {bills.length === 0 ? (
        <p>No bills found.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Type</th>
              <th>Source</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.type}</td>
                <td>{bill.source}</td>
                <td>{bill.amount}</td>
                <td>{bill.date}</td>
                <td>{bill.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BillList;
