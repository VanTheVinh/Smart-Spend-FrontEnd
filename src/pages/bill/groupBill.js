import React, { useState } from 'react';
import BillList from '.';

const GroupBill = ({ userId, groupId,  }) => {
  // State cho tháng/năm và loại
  const [selectedDate, setSelectedDate] = useState('2024-12'); // Mặc định mm/yyyy
  const [type, setType] = useState('ALL'); // Mặc định là "Tất cả"

  // Tách tháng và năm từ selectedDate
  const [year, month] = selectedDate.split('-').map(Number);

  return (
    <div>
      <div>
        <label>
          Tháng/Năm:
          <input
            type="month"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
        <label>
          Loại:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="ALL">Tất cả</option>
            <option value="CHI">Chi tiêu</option>
            <option value="THU">Thu nhập</option>
          </select>
        </label>
      </div>

      <BillList
        userId={userId}
        groupId={groupId}
        month={month}
        year={year}
        type={type}
      />
    </div>
  );
};

export default GroupBill;
