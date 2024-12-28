// src/store/actions.js

export const fetchBillsRequest = () => ({
    type: 'FETCH_BILLS_REQUEST',
  });
  
  export const fetchBillsSuccess = (bills) => ({
    type: 'FETCH_BILLS_SUCCESS',
    payload: bills,
  });
  
  export const fetchBillsFailure = (error) => ({
    type: 'FETCH_BILLS_FAILURE',
    payload: error,
  });

  
export const fetchCategoriesRequest = () => ({
    type: 'FETCH_CATEGORIES_REQUEST',
  });
  
  export const fetchCategoriesSuccess = (categories) => ({
    type: 'FETCH_CATEGORIES_SUCCESS',
    payload: categories,
  });
  
  export const fetchCategoriesFailure = (error) => ({
    type: 'FETCH_CATEGORIES_FAILURE',
    payload: error,
  });
  