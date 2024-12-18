import React, { useState, useEffect, useContext } from 'react';
import { getUserInfo, updateUser } from '~/services/userService'; // Dịch vụ lấy và cập nhật thông tin người dùng
import { AppContext } from '~/contexts/appContext';

const UpdateUserForm = () => {
    const { userId } = useContext(AppContext); // Lấy userId từ context

    const [userData, setUserData] = useState({
        username: '',
        fullname: '',
        password: '',
        confirmPassword: '' // Mật khẩu xác nhận
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingUserInfo, setLoadingUserInfo] = useState(true); // Trạng thái tải thông tin người dùng

    // Gọi API để lấy thông tin người dùng khi component được mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getUserInfo(userId);
                console.log('Data:', response);
                
                setUserData({
                    username: response.username,
                    fullname: response.fullname || '', // Cập nhật thông tin từ API
                    password: '', // Mật khẩu không tải từ server, để trống
                    confirmPassword: '' // Mật khẩu xác nhận không tải
                });
            } catch (error) {
                setError('Không thể tải thông tin người dùng.');
                console.error('Lỗi khi tải thông tin người dùng:', error);
            } finally {
                setLoadingUserInfo(false); // Đã tải xong thông tin người dùng
            }
        };

        fetchUserData();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(''); // Reset error message trước khi gửi request

        // Kiểm tra nếu mật khẩu mới và xác nhận mật khẩu không khớp
        if (userData.password !== userData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await updateUser(userId, userData);
            // Xử lý kết quả thành công (ví dụ, hiển thị thông báo hoặc cập nhật giao diện)
            console.log('Cập nhật thông tin người dùng thành công:', response);
        } catch (error) {
            // Xử lý lỗi (ví dụ, hiển thị thông báo lỗi)
            setError('Đã xảy ra lỗi trong quá trình cập nhật thông tin.');
            console.error('Lỗi khi cập nhật thông tin người dùng:', error);
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    // Nếu đang tải thông tin người dùng thì hiển thị loader
    if (loadingUserInfo) {
        return <p>Đang tải thông tin người dùng...</p>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Tên đăng nhập</label>
                <input
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    disabled // Không cho phép thay đổi tên đăng nhập
                />
            </div>
            <div>
                <label>Họ và tên</label>
                <input
                    type="text"
                    name="fullname"
                    value={userData.fullname}
                    onChange={handleInputChange}
                />
            </div>
            
            <div>
                <label>Mật khẩu mới</label>
                <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label>Xác nhận mật khẩu</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    onChange={handleInputChange}
                />
            </div>
            
            <button type="submit" disabled={isLoading}>Cập nhật thông tin</button>
            
            {isLoading && <p>Đang cập nhật...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default UpdateUserForm;
