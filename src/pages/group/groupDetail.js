import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import debounce from 'lodash/debounce';
import '@fortawesome/fontawesome-free/css/all.min.css';

import {
  getGroupMembers,
  getGroupDetail,
  searchUser,
  addMember,
  updateMemberAmount,
  deleteMember,
  updateGroupDetail, // API chỉnh sửa thông tin nhóm
} from '~/services/groupService';
import { AppContext } from '~/contexts/appContext';
import GroupBill from '../bill/groupBill';

const GroupDetail = () => {
  const { userId } = useContext(AppContext); // Lấy userId từ context
  const { groupId } = useParams(); // Lấy groupId từ route params
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [editingGroup, setEditingGroup] = useState(false); // Trạng thái chỉnh sửa thông tin nhóm
  const [groupDetails, setGroupDetails] = useState({
    group_name: '',
    status: '',
    amount: '',
    update_by: Number(userId),
  });
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [memberAmount, setMemberAmount] = useState('');

  console.log('userId', userId);
  

  const fetchGroupDetail = async () => {
    try {
      console.log('UserId: ', userId);
      
      const data = await getGroupDetail(groupId);
      setGroup(data.group);
      setGroupDetails({
        group_name: data.group.group_name,
        status: data.group.status,
        amount: data.group.amount,
        update_by: Number(userId),
      });
    } catch (err) {
      setError('Không thể lấy thông tin nhóm.');
    }
  };

  const fetchMembers = async () => {
    try {
      const data = await getGroupMembers({ group_id: groupId });
      setMembers(data.members);
    } catch (err) {
      setError('Không thể lấy thông tin thành viên.');
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchGroupDetail();
      fetchMembers();
    }
  }, [userId, groupId]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const data = await searchUser(query);
      setSearchResults(data.users);
    } catch (err) {
      setError('Không thể tìm kiếm người dùng.');
    }
  };

  const debouncedSearch = debounce((query) => handleSearch(query), 200);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleAddMember = async (groupId, userId) => {
    try {
      const response = await addMember(groupId, userId);
      fetchMembers();
      alert(response.message);
    } catch (err) {
      setError('Lỗi khi thêm thành viên. Vui lòng thử lại.');
    }
  };

  const handleUpdateMemberAmount = async (memberId, amount) => {
    try {
      if (!amount || amount < 0) {
        setError('Số tiền không hợp lệ.');
        return;
      }

      const response = await updateMemberAmount(groupId, memberId, amount, userId);
      fetchGroupDetail();
      fetchMembers();

      alert(response.message || 'Cập nhật thành công!');
      setEditingMemberId(null); // Đóng phần chỉnh sửa sau khi cập nhật
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Lỗi khi cập nhật số tiền thành viên.';
      setError(errorMessage);
    }
  };

  const handleDeleteMember = async (memberId) => {
    try {
      const response = await deleteMember({
        group_id: groupId,
        user_id: memberId,
        deleted_by: userId,
      });

      fetchMembers(); // Tải lại danh sách thành viên sau khi xóa
      alert(response.message || 'Xóa thành viên thành công!');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Lỗi khi xóa thành viên.';
      setError(errorMessage);
    }
  };

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleEditGroupToggle = () => {
    setEditingGroup((prev) => !prev);
  };

  const handleGroupDetailsChange = (e) => {
    const { name, value } = e.target;
    setGroupDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUpdateGroupDetails = async () => {
    try {
      // console.log('groupDetails', groupDetails);
      // console.log('grid', groupId);
      
      // Ép kiểu amount về number trước khi gửi
    // const formatGroupDetails = {
    //   ...groupDetails,
    //   amount: Number(groupDetails.amount), // Ép kiểu thành number
    // };
    // console.log('groupDetails', groupDetails);
    

      const response = await updateGroupDetail(groupId, groupDetails);
      fetchGroupDetail();
      alert(response.message || 'Cập nhật thông tin nhóm thành công!');
      setEditingGroup(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Lỗi khi cập nhật thông tin nhóm.';
      setError(errorMessage);
    }
  };

  const formatCurrency = (amount) => {
    return Number(amount).toLocaleString('vi-VN');
  };

  const closeEdit = () => {
    setEditingMemberId(null); // Đóng phần chỉnh sửa
    setMemberAmount(''); // Xóa dữ liệu số tiền
  };

  const isAdmin = () => {
    return members.some(
      (member) => member.user_id === parseInt(userId) && member.role === 'admin',
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 shadow-lg">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">CHI TIẾT NHÓM</h1>
      <h3 className="text-lg font-medium text-gray-600 mb-4">User ID: {userId}</h3>
  
      {group && !editingGroup && (
        <div className="p-5 bg-white rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">Tên nhóm: {group.group_name}</h3>
          <p className="text-gray-600 mb-2">
            <strong>Trạng thái:</strong> {group.status}
          </p>
          <p className="text-gray-600 mb-4">
            <strong>Ngân sách nhóm:</strong> {formatCurrency(group.amount)} đ
          </p>
          {isAdmin() && (
            <button
              onClick={handleEditGroupToggle}
              className="px-4 py-2 bg-tealCustom text-white font-medium rounded-md hover:bg-teal-600"
            >
              Chỉnh sửa nhóm
            </button>
          )}
        </div>
      )}
  
      {editingGroup && (
        <div className="p-5 bg-white rounded-lg shadow-md mt-6">
          <h3 className="text-xl font-bold text-gray-700 mb-4">Chỉnh sửa thông tin nhóm</h3>
          <label className="block mb-4">
            <span className="block text-sm font-medium text-gray-600">Tên nhóm:</span>
            <input
              type="text"
              name="group_name"
              value={groupDetails.group_name}
              onChange={handleGroupDetailsChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
            />
          </label>
          <label className="block mb-4">
            <span className="block text-sm font-medium text-gray-600">Trạng thái:</span>
            <input
              type="text"
              name="status"
              value={groupDetails.status}
              onChange={handleGroupDetailsChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
            />
          </label>
          <label className="block mb-4">
            <span className="block text-sm font-medium text-gray-600">Ngân sách:</span>
            <input
              type="number"
              name="amount"
              value={groupDetails.amount}
              onChange={handleGroupDetailsChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
            />
          </label>
          <div className="flex justify-end gap-4">
            <button
              onClick={handleUpdateGroupDetails}
              className="px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600"
            >
              Lưu
            </button>
            <button
              onClick={handleEditGroupToggle}
              className="px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
  
      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">Danh sách thành viên</h2>
      {members.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-300 bg-white rounded-lg shadow-md">
            <thead>
              <tr className=" text-gray-700">
                <th className="p-3 border border-gray-300">Thành viên</th>
                <th className="p-3 border border-gray-300">Ngân sách</th>
                <th className="p-3 border border-gray-300">Ngày tham gia</th>
                <th className="p-3 border border-gray-300">Trạng thái</th>
                <th className="p-3 border border-gray-300">Vai trò</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.user_id} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-300">{member.full_name}</td>
                  <td className="p-3 border border-gray-300">
                    {editingMemberId === member.user_id ? (
                      <input
                        type="number"
                        value={memberAmount}
                        onChange={(e) => setMemberAmount(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    ) : (
                      formatCurrency(member.member_amount)
                    )}
                  </td>
                  <td className="p-3 border border-gray-300">{member.joined_at}</td>
                  <td className="p-3 border border-gray-300">{member.status}</td>
                  <td className="p-3 border border-gray-300">{member.role}</td>
                  {isAdmin() && (
                    <td className="p-3 border border-gray-300 text-center">
                      {editingMemberId === member.user_id ? (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateMemberAmount(
                                member.user_id,
                                memberAmount,
                              )
                            }
                            className="px-3 py-1 text-tealEdit rounded-md hover:bg-green-200"
                          >
                            <i className="fa-solid fa-check"></i>
                          </button>
                          <button
                            onClick={closeEdit}
                            className="px-3 py-1 text-red-600 rounded-md hover:bg-red-300"
                          >
                            <i class="fa-regular fa-rectangle-xmark"></i>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingMemberId(member.user_id);
                            setMemberAmount(member.member_amount);
                          }}
                          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          Chỉnh sửa
                        </button>
                      )}
                    </td>
                  )}
                  {isAdmin() && (
                    <td className="p-3 border border-gray-300">
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              'Bạn có chắc chắn muốn xóa thành viên này không?',
                            )
                          ) {
                            handleDeleteMember(member.user_id);
                          }
                        }}
                        disabled={member.role === 'admin'}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                      >
                        Xóa
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">Không có thành viên trong nhóm này.</p>
      )}
  
      <button
        onClick={toggleSearch}
        className="mt-6 px-4 py-2 bg-teal-500 text-white font-medium rounded-md hover:bg-teal-600"
      >
        {showSearch ? 'Đóng' : 'Thêm thành viên'}
      </button>
  
      {showSearch && (
        <div className="mt-6 p-5 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Tìm kiếm người dùng</h2>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Nhập tên người dùng..."
            className="block w-full p-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 mb-4"
          />
          {searchQuery && searchResults.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Kết quả tìm kiếm</h3>
              <table className="w-full text-left border-collapse border border-gray-300 bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="p-3 border border-gray-300">ID</th>
                    <th className="p-3 border border-gray-300">Họ tên</th>
                    <th className="p-3 border border-gray-300">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="p-3 border border-gray-300">{user.id}</td>
                      <td className="p-3 border border-gray-300">{user.fullname}</td>
                      <td className="p-3 border border-gray-300">
                        <button
                          onClick={() => handleAddMember(groupId, user.id)}
                          className="px-3 py-1 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                        >
                          Thêm
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
  
      {error && <p className="mt-4 text-red-500">{error}</p>}
  
      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">Group Bill</h2>
      <GroupBill userId={userId} groupId={groupId} />
    </div>
  );
};  
export default GroupDetail;
