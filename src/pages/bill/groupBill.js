import React, { useState } from 'react';
import BillList from '.';

const GroupBill = ({ userId, groupId }) => {
  // State cho tháng/năm và loại
  const [selectedDate, setSelectedDate] = useState('2024-12'); // Mặc định mm/yyyy
  const [type, setType] = useState('ALL'); // Mặc định là "Tất cả"

  // Tách tháng và năm từ selectedDate
  const [year, month] = selectedDate.split('-').map(Number);

  return (
    <div>
      <div className="flex items-center space-x-6 mb-4">
        <div className="flex items-center">
          <label className="text-2xl font-medium">
            Thời gian:
            <input
              type="month"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="ml-2 p-2 border border-tealColor00 rounded-md focus:ring-teal-500 focus:border-teal-500"
            />
          </label>
        </div>

        <div className="flex items-center">
          <label className="text-2xl font-medium">
            Loại:
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="ml-2 p-2 border border-tealColor00 rounded-md focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="ALL">Tất cả</option>
              <option value="CHI">Chi tiêu</option>
              <option value="THU">Thu nhập</option>
            </select>
          </label>
        </div>
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
