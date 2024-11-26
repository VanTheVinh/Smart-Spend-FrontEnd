import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Địa chỉ API của Flask

export const bill = (type, source, amount, date, description,  user_id, category_id) => {
    return axios.post(`${API_URL}/bill`, {
        type,
        source,
        amount,
        date,
        description,
        user_id,
        category_id
    });
  };