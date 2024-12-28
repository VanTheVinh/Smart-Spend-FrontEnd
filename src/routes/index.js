import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UserBill from '~/pages/bill/userBill';
import GroupBill from '~/pages/bill/groupBill';
import Group from '~/pages/group';
import GroupDetail from '~/pages/group/groupDetail';
import Profile from '~/pages/profile';
import DashboardLayout from '~/components/dashboard';
import UserCategory from '~/pages/category/userCategory';
import DashboardOverview from '~/pages/dashBoardOverview';
// import ResetPassword from '~/components/ResetPassword';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />} />
      <Route element={<DashboardLayout />}>
      {/* <Route path="/home" element={<Home />} /> */}
      <Route path="/user-bill" element={<UserBill />} />
      <Route path="/group-bill" element={<GroupBill />} />
      <Route path="/user-category" element={<UserCategory />} />
      <Route path="/group" element={<Group />} />
      <Route path="/group-detail/:groupId" element={<GroupDetail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<DashboardOverview />} />
      {/* <Route path="/reset-password/:token" element={<ResetPassword />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRouter;
