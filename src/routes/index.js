import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '~/components/login';
import Register from '~/components/register';
import Dashboard from '~/components/dashboard';
import Bill from '~/components/bill';
import CategoryList from '~/components/category';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bill" element={<Bill />} />
        <Route path="/category" element={<CategoryList />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
