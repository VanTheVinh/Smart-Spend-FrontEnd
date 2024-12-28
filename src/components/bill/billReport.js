import { useEffect, useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2'; // Sử dụng Pie hoặc Doughnut biểu đồ bánh rán
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getBillReport } from '~/services/billService';

ChartJS.register(ArcElement, Tooltip, Legend);

const BillReport = ({ month, year, type, userId }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const canvasRef = useRef(null); // Lưu trữ canvas
  const chartInstanceRef = useRef(null); // Lưu trữ instance của biểu đồ

  useEffect(() => {
    const fetchBillReport = async () => {
      try {
        const params = { user_id: userId, month, year, type };
        const data = await getBillReport(params);

        if (data && data.length > 0) {
          const labels = data.map((item) => item.category_name);
          const values = data.map((item) => item.total_spent);

          setChartData({
            labels: labels,
            datasets: [
              {
                data: values,
                backgroundColor: [
                  '#FFB6B9',
                  '#FFCD94',
                  '#21A691',
                  '#A1D6D2',
                  '#FF8C94',
                ],
                hoverBackgroundColor: [
                  '#FF8D8F',
                  '#FFB06E',
                  '#1A8E7C',
                  '#80B8B5',
                  '#FF6E7A',
                ],
              },
            ],
          });
        } else {
          setChartData(null);
        }
      } catch (error) {
        console.error('Lỗi khi lấy báo cáo hóa đơn:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillReport();

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [month, year, type, userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold">Đang tải thông tin...</div>
      </div>
    );
  }

  if (!chartData) {
    return <div>Không có dữ liệu.</div>;
  }

  return (
    // <div className="bg-white shadow-lg rounded-lg p-6">
    <div className="flex flex-col md:flex-row gap-8 justify-center items-center w-full">
      {/* Biểu đồ */}
      <div className="w-full md:w-3/4 lg:w-2/3 bg-white rounded-lg p-6">
        <Pie
          ref={canvasRef}
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false, // Đảm bảo biểu đồ không bị giới hạn tỉ lệ
            plugins: {
              legend: {
                position: 'right', // Đặt legend ở bên phải
                labels: {
                  boxWidth: 18, // Kích thước hộp màu
                  padding: 10, // Khoảng cách giữa các mục legend
                  font: {
                    size: 13, // Kích thước chữ trong legend
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default BillReport;
