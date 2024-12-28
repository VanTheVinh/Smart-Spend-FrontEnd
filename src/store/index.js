// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage'; // Sử dụng storage mặc định (localStorage)
import { persistReducer, persistStore } from 'redux-persist';

// Import từ categorySlice
import categoryReducer from './categorySlice'; // Đường dẫn tương ứng với vị trí lưu file categorySlice.js

// Reducer quản lý hóa đơn
const billsReducer = (state = { bills: [], loading: true, error: null }, action) => {
  switch (action.type) {
    case 'FETCH_BILLS_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_BILLS_SUCCESS':
      return { ...state, loading: false, bills: action.payload };
    case 'FETCH_BILLS_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Reducer quản lý danh mục cũ
const categoriesReducer = (state = { categories: {}, loading: true, error: null }, action) => {
  switch (action.type) {
    case 'FETCH_CATEGORIES_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_CATEGORIES_SUCCESS':
      return { ...state, loading: false, categories: action.payload };
    case 'FETCH_CATEGORIES_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  bills: billsReducer,
  categories: categoriesReducer,
  categorySlice: categoryReducer, // Thêm categoryReducer vào
});

// Cấu hình persist
const persistConfig = {
  key: 'root', // Key lưu trữ trong localStorage
  storage, // Loại storage (localStorage mặc định)
  whitelist: ['bills', 'categories', 'categorySlice'], // Thêm categorySlice vào whitelist
};

// Áp dụng persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo store Redux
const store = configureStore({
  reducer: persistedReducer, // Sử dụng persistedReducer thay vì rootReducer
});

// Tạo persistor
export const persistor = persistStore(store);

export default store;
