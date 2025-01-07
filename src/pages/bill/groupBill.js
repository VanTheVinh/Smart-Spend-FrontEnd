import React, { useState } from 'react';
import BillList from '.';

const GroupBill = ({ userId, groupId }) => {
  // State cho tháng/năm và loại
  const [selectedDate, setSelectedDate] = useState('2024-12'); // Mặc định mm/yyyy
  const [type, setType] = useState('ALL'); // Mặc định là "Tất cả"

  // Tách tháng và năm từ selectedDate
  const [year, month] = selectedDate.split('-').map(Number);

  return (
    <div className="pt-4 bg-gray-100">
      <div className="bg-white shadow rounded-lg p-6 mb-10 px-20">
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
          </div>
        </div>

        {/* Danh sách hóa đơn */}
        <BillList
          userId={userId}
          groupId={groupId}
          month={month}
          year={year}
          type={type}
        />
      </div>
    </div>
  );
};

export default GroupBill;
