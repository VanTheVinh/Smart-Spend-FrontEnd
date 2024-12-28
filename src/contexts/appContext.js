import React, { createContext, useState, useEffect, useContext } from 'react';
import { getBills } from '~/services/billService';
import { getCategoryByUserId } from '~/services/categoryService';

// Tạo context
export const AppContext = createContext();

// Tạo provider để cung cấp giá trị cho context
export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [bills, setBills] = useState([]);
  const [categoryNames, setCategoryNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Lấy user_id từ localStorage khi ứng dụng khởi chạy
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      console.error('User ID is missing!');
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/get-categories?user_id=${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data); // Lưu danh sách categories vào context
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [userId]);

  // Hàm lấy dữ liệu hóa đơn (bills) cho userId hoặc groupId
  const fetchBillsData = async (userId, groupId) => {
    setLoading(true);
    try {
      let billData = [];
      if (groupId) {
        billData = await getBills({ group_id: groupId });
        billData = billData.filter((bill) => bill.is_group_bill);
      } else {
        billData = await getBills({ user_id: userId });
        billData = billData.filter((bill) => !bill.is_group_bill && Number(bill.user_id) === Number(userId));
      }
      // Sắp xếp theo ngày tăng dần
      billData.sort((a, b) => new Date(a.date) - new Date(b.date));
      setBills(billData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy tên danh mục (category) cho các hóa đơn
  const fetchCategoryNames = async (bills) => {
    const userIds = [...new Set(bills.map((bill) => bill.user_id))];
    const names = {};
    for (const userId of userIds) {
      const categories = await getCategoryByUserId(userId);
      for (const bill of bills) {
        const category = categories.find((category) => category.id === bill.category_id);
        if (category) {
          names[bill.category_id] = category.category_name;
        }
      }
    }
    setCategoryNames(names);
  };

  // Cung cấp các giá trị context
  const value = {
    userId,
    setUserId,
    categoryId,
    setCategoryId,
    categories,
    setCategories,
    isAuthenticated,
    setIsAuthenticated,
    bills,
    setBills,
    categoryNames,
    setCategoryNames,
    loading,
    error,
    fetchBillsData,
    fetchCategoryNames,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook để sử dụng AppContext
export const useAppContext = () => useContext(AppContext);
