import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '~/pages/login';
import Register from '~/pages/register';
import Dashboard from '~/components/dashboard';
import UserBill from '~/pages/bill/userBill';
import GroupBill from '~/pages/bill/groupBill';
import CategoryList from '~/pages/category';
import Group from '~/pages/group';
import GroupDetail from '~/pages/group/groupDetail';
import Home from '~/pages/home';
import Profile from '~/pages/profile';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Dashboard />}>
        <Route path="/home" element={<Home />} />
        <Route path="/user-bill" element={<UserBill />} />
        <Route path="/group-bill" element={<GroupBill />} />
        <Route path="/category" element={<CategoryList />} />
        <Route path="/group" element={<Group />} />
        <Route path="/group-detail/:groupId" element={<GroupDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
