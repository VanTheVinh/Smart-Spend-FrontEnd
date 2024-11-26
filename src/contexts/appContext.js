import React, { createContext, useState } from 'react';

// Tạo context
export const AppContext = createContext();

// Tạo provider để cung cấp giá trị cho context
export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  return (
    <AppContext.Provider value={{ userId, setUserId, categoryId, setCategoryId, categories, setCategories }}>
      {children}
    </AppContext.Provider>
  );
};
