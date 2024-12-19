import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '~/pages/login';
import Register from '~/pages/register';
import Dashboard from '~/components/dashboard';
import UserBill from '~/pages/bill/userBill';
import GroupBill from '~/pages/bill/groupBill';
import CategoryList from '~/pages/category';
import Group from '~/pages/group';
import GroupDetail from '~/pages/group/groupDetail';
import Home from '~/pages/home';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Dashboard />}>
        <Route path="/home" element={<Home />} />
        <Route path="/user-bill" element={<UserBill />} />
        <Route path="/group-bill" element={<GroupBill />} />
        <Route path="/category" element={<CategoryList />} />
        <Route path="/group" element={<Group />} />
        <Route path="/group-detail/:groupId" element={<GroupDetail />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
