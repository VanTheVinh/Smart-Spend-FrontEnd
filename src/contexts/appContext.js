import React, { createContext, useState, useEffect } from 'react';

// Tạo context
export const AppContext = createContext();

// Tạo provider để cung cấp giá trị cho context
export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

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
        console.log(data); // In dữ liệu categories để kiểm tra
        setCategories(data); // Lưu danh sách categories vào context
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    fetchCategories();
  }, [userId]); // Chỉ chạy 1 lần khi component được mount

  return (
    <AppContext.Provider value={{ userId, setUserId, categoryId, setCategoryId, categories, setCategories }}>
      {children}
    </AppContext.Provider>
  );
};
