import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons'; // Import các icon từ Font Awesome

const Home = () => {
  const navigate = useNavigate(); // Khởi tạo navigate

  // Hàm xử lý chuyển hướng đến trang đăng nhập
  const goToLogin = () => {
    navigate('/login');
  };

  // Hàm xử lý chuyển hướng đến trang đăng ký
  const goToRegister = () => {
    navigate('/register');
  };

  const goToDashboard = () => {
    navigate('/');
    // window.location.reload();
  }

  return (
    <div className="font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-2 bg-tealColor00 text-white">
        <h1 className="text-3xl font-semibold">Expense Tracker</h1>
        <div className="flex space-x-4"> {/* Thêm space-x-4 để tạo khoảng cách giữa các nút */}
          <button
            onClick={goToRegister}
            className="bg-tealColor03 text-tealCustom px-6 py-2 rounded-md hover:bg-tealEdit transition duration-300 flex items-center"
          >
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" /> {/* Icon đăng ký */}
            Đăng ký
          </button>
          <button
            onClick={goToLogin}
            className="bg-tealColor02 text-white px-6 py-2 rounded-md hover:bg-tealCustom transition duration-300 flex items-center"
          >
            <FontAwesomeIcon icon={faSignInAlt} className="mr-2" /> {/* Icon đăng nhập */}
            Đăng nhập
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center py-20 bg-tealColor06">
        <h2 className="text-4xl font-bold text-tealCustom mb-4">
          Quản lý chi tiêu của bạn một cách thông minh!
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Khám phá cách tiết kiệm và kiểm soát ngân sách dễ dàng.
        </p>
        <button
          onClick={goToDashboard}
          className="bg-tealColor00 text-white px-8 py-3 rounded-full hover:bg-tealEdit transition duration-300"
        >
          Bắt đầu ngay
        </button>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 bg-tealColor06">
        <h3 className="text-3xl font-semibold text-center text-tealCustom mb-12">
          Tính năng nổi bật
        </h3>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {[
            'Phân tích chi tiêu theo danh mục',
            'Gợi ý chiến lược tiết kiệm thông minh',
            'Theo dõi ngân sách hàng tuần',
          ].map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-tealColor09 p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
            >
              <div className="w-16 h-16 bg-tealColor00 rounded-full flex items-center justify-center mb-6">
                <span className="text-white text-2xl font-semibold">
                  {index + 1}
                </span>
              </div>
              <h4 className="text-xl font-semibold text-tealCustom mb-4">
                {feature}
              </h4>
              <p className="text-center text-gray-600">
                Khám phá cách tính năng này giúp bạn quản lý ngân sách và chi
                tiêu một cách hiệu quả.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 bg-tealColor10 text-white text-center">
        <p>© 2024 Expense Tracker. Tất cả quyền được bảo lưu.</p>
        <p>Liên hệ: support@expensetracker.com</p>
      </footer>
    </div>
  );
};

export default Home;
