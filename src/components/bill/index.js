import React, { useState , useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { bill } from '~/services/billService';
import { AppContext } from '~/contexts/appContext';

const Bill = () => {
    const { userId, categoryId } = useContext(AppContext);
    console.log("User ID:", categoryId); // In ra userId để kiểm tra

    const [type, setType] = useState('');
    const [source, setPaymentMethod] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await bill(
            type,
            source,
            amount,
            date,
            description,
            userId,
            categoryId
        );
          setMessage(`${response.data.message}`);
        } catch (error) {
          if (error.response && error.response.data) {
            setMessage(`${error.response.data.message}`);
          } else {
            setMessage('Đã xảy ra lỗi.');
          }
        }
      };

    return (
        <div>
            <h2>Hóa đơn chi tiêu</h2>
                <form id="transactionForm" onSubmit={handleSubmit}>
                    <div>
                        <label for="type">Loại: </label>
                            <select 
                                value={type} 
                                onChange={(e) => setType(e.target.value)} 
                                required
                            >
                                <option value="">Chọn loại</option>
                                <option value="THU">THU</option>
                                <option value="CHI">CHI</option>
                            </select>
                    </div>
                    <div> 
                        <label for="source">Nguồn: </label>
                        <select 
                            value={source} 
                            onChange={(e) => setPaymentMethod(e.target.value)} 
                            required
                        >
                            <option value="">Chọn phương thức</option>
                            <option value="CHUYỂN KHOẢN">CHUYỂN KHOẢN</option>
                            <option value="TIỀN MẶT">TIỀN MẶT</option>
                        </select>
                    </div>
                    <div> 
                        <label for="amount">Số tiền: </label>
                        <input 
                        type="number" 
                        id="amount" 
                        name="amount" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required min = "0" />
                    </div> 
                    <div> 
                        <label for="date">Ngày:</label>
                        <input 
                            type="date" 
                            id="date" 
                            name="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)} required />
                    </div>
                    <div> 
                        <label for="description">Mô tả: </label>
                        <textarea 
                            id="description" 
                            name="description" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        >
                        </textarea>
                    </div>
                <button type="submit">Xác nhận</button>
                </form>
                {message && <p>{message}</p>}
        </div>
    );
};
export default Bill;