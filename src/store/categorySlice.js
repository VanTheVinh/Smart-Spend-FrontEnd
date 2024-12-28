// store/categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCategoryByUserId } from '~/services/categoryService';
import { getUserInfo } from '~/services/userService';

// Async Thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (userId, thunkAPI) => {
    try {
      const data = await getCategoryByUserId(userId);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchUserInfo = createAsyncThunk(
  'categories/fetchUserInfo',
  async (userId, thunkAPI) => {
    try {
      const data = await getUserInfo(userId);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Slice
const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    selectedCategory: null,
    budget: null,
    loading: false,
    error: null,
    totalPercentageLimit: 0,
  },
  reducers: {
    setFilterType(state, action) {
      state.filterType = action.payload;
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Fetch user info
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.budget = action.payload.budget;
        state.loading = false;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setFilterType, setSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
