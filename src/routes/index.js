import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '~/pages/login';
import Register from '~/pages/register';
import Dashboard from '~/pages/dashboard';
import UserBill from '~/pages/bill/userBill';
import GroupBill from '~/pages/bill/groupBill';
import CategoryList from '~/pages/category';
import Group from '~/pages/group';
import GroupDetail from '~/pages/group/groupDetail';
import UpdateUserForm from '~/pages/user/updateUser';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/update-user" element={<UpdateUserForm />} />
      <Route path="/user-bill" element={<UserBill />} />
      <Route path="/group-bill" element={<GroupBill />} />
      <Route path="/category" element={<CategoryList />} />
      <Route path="/group" element={<Group />} />
      <Route path="/group-detail/:groupId" element={<GroupDetail />} />
    </Routes>
  );
};

export default AppRouter;
