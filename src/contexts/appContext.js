import React, { createContext, useState, useEffect } from 'react';

// Tạo context
export const AppContext = createContext();

// Tạo provider để cung cấp giá trị cho context
export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState('');
  const [userBudget, setBudget] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Lấy user_id từ localStorage khi ứng dụng khởi chạy
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    }

    // Lấy budget từ localStorage khi ứng dụng khởi chạy
    const storedBudget = localStorage.getItem('budget');
    if (storedBudget) {
      setBudget(storedBudget);
    }
  }, []);

  useEffect(() => {

    if (!userId) {
      console.error('User ID is missing!');
      return;
    }

    const fetchUserBudget = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/get-user-budget?user_id=${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setBudget(data.budget); // Giả định API trả về trường 'budget'
      } catch (error) {
        console.error('Error fetching user budget:', error);
      }
    };

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
  
    fetchUserBudget(); // Gọi API lấy user budget và set giá trị cho context
    fetchCategories();
  }, [userId]); // Chỉ chạy 1 lần khi component được mount

  return (
    <AppContext.Provider value={{ userId, setUserId, userBudget, setBudget, categoryId, setCategoryId, categories, setCategories }}>
      {children}
    </AppContext.Provider>
  );
};
