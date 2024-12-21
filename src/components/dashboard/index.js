import React from "react";
import Sidebar from "../sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className=" bg-white shadow-md h-screen">
        <Sidebar />
      </aside>

      {/* Nội dung chính */}
      <main className="flex-grow container mx-auto mt-20 bg-gray-100 h-screen overflow-auto ">
        <Outlet /> {/* Các trang con sẽ hiển thị ở đây */}
      </main>
    </div>
  );
};

export default DashboardLayout;
