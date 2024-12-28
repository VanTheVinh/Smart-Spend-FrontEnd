// src/context/BillContext.js
import React, { createContext, useState, useContext } from 'react';

// Tạo context
const BillContext = createContext();

// Tạo provider để cung cấp giá trị context cho các component con
export const BillProvider = ({ children }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [amountSortOrder, setAmountSortOrder] = useState('default');
  const [categoryNames, setCategoryNames] = useState({});

  return (
    <BillContext.Provider
      value={{
        bills,
        setBills,
        loading,
        setLoading,
        error,
        setError,
        filterType,
        setFilterType,
        amountSortOrder,
        setAmountSortOrder,
        categoryNames,
        setCategoryNames
      }}
    >
      {children}
    </BillContext.Provider>
  );
};

// Custom hook để sử dụng context trong các component
export const useBillContext = () => useContext(BillContext);
