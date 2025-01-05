import React, { useState, useEffect, useContext, useCallback } from 'react';
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

  // console.log('userId', userId);

  const fetchGroupDetail = useCallback(async () => {
    try {
      // console.log('UserId: ', userId);

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
  }, [groupId, userId]);

  const fetchMembers = useCallback(async () => {
    try {
      const data = await getGroupMembers({ group_id: groupId });
      setMembers(data.members);
    } catch (err) {
      setError('Không thể lấy thông tin thành viên.');
    }
  }, [groupId]); // Thêm groupId vào dependencies của useCallback

  useEffect(() => {
    if (groupId) {
      fetchGroupDetail();
      fetchMembers();
    }
  }, [groupId, fetchGroupDetail, fetchMembers]);

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

      const response = await updateMemberAmount(
        groupId,
        memberId,
        amount,
        userId,
      );
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
      (member) =>
        member.user_id === parseInt(userId) && member.role === 'admin',
    );
  };

  return (
    <div>
      <div className="flex flex-col justify-center mx-14">
        <div className="">
          <div className="bg-white p-6 shadow-md mt-8">
            <h3 className="text-4xl text-tealColor11 font-bold mb-12 flex items-center">
              <button
                onClick={() => window.history.back()} // Quay lại trang trước
                className="text-base text-tealColor11 font-medium px-4 py-2 border border-tealColor11 rounded-md hover:bg-tealColor11 hover:text-white transition"
              >
                Quay lại
              </button>
              <span className="flex-grow text-center mr-28">CHI TIẾT NHÓM</span>
            </h3>

            {group && (
              <div className=" bg-tealColor06 border-b-2 border-tealColor11 p-4 mb-16 h-20">
                <div className="flex items-center justify-between mb-4 mx-14">
                  <p>
                    <strong>Tên nhóm: </strong> {group.group_name}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong> {group.status}
                  </p>
                  <p>
                    <strong>Ngân sách nhóm:</strong>{' '}
                    {formatCurrency(group.amount)} đ
                  </p>
                  <p>
                    <strong>Ngân sách thực tế:</strong>{' '}
                    {formatCurrency(group.actual_amount)} đ
                  </p>
                  {isAdmin() && (
                    <button
                      onClick={handleEditGroupToggle}
                      className="px-2 py-1 text-tealColor06"
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                  )}
                </div>
              </div>
            )}

            {editingGroup && (
              <div
                className="p-8 bg-openForm rounded-lg shadow-md mt-4 mb-11 mx-auto"
                style={{ maxWidth: '500px', width: '100%' }}
              >
                <h3 className="text-2xl text-center font-bold text-gray-700 mb-4">
                  Chỉnh sửa thông tin nhóm
                </h3>
                <label className="block mb-4">
                  <span className="block text-xl font-medium text-gray-600 mb-3">
                    Tên nhóm:
                  </span>
                  <input
                    type="text"
                    name="group_name"
                    value={groupDetails.group_name}
                    onChange={handleGroupDetailsChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-tealCustom"
                  />
                </label>
                <label className="block mb-4">
                  <span className="block text-sm font-medium text-gray-600 mb-3">
                    Trạng thái:
                  </span>
                  <input
                    type="text"
                    name="status"
                    value={groupDetails.status}
                    onChange={handleGroupDetailsChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-tealCustom"
                  />
                </label>
                <label className="block mb-4">
                  <span className="block text-sm font-medium text-gray-600 mb-3">
                    Ngân sách:
                  </span>
                  <input
                    type="number"
                    name="amount"
                    value={groupDetails.amount}
                    onChange={handleGroupDetailsChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-tealCustom"
                  />
                </label>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleUpdateGroupDetails}
                    className="px-4 py-2 bg-tealCustom text-white font-bold rounded-md hover:bg-teal-600"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={handleEditGroupToggle}
                    className="bg-gray-500 font-bold text-white px-4 py-2 rounded"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white shadow-lg">
            {/* <h2 className="text-center font-bold mb-10">
              DANH SÁCH THÀNH VIÊN NHÓM
            </h2> */}
            {members.length > 0 ? (
              <div className="overflow-x-auto rounded-xl shadow-sm">
                <table className="min-w-full border-collapse text-center bg-white shadow-md">
                  <thead>
                    <tr className=" text-black border-b-2 border-tealColor06">
                      <th className="py-4 px-4">Thành viên</th>
                      <th className="py-4 px-4">Ngân sách</th>
                      <th className="py-4 px-4">Ngày tham gia</th>
                      <th className="py-4 px-4">Trạng thái</th>
                      <th className="py-4 px-4">Vai trò</th>
                      <th className="py-4 px-4"></th>
                      <th className="py-4 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member, index) => (
                      <tr
                        key={member.user_id}
                        className={index % 2 === 1 ? 'bg-tdOdd' : 'bg-white'}
                      >
                        <td className="py-4 px-4">{member.full_name}</td>
                        <td className="py-4 px-4">
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
                        <td className="py-4 px-4">{member.joined_at}</td>
                        <td className="py-4 px-4">{member.status}</td>
                        <td className="py-4 px-4">{member.role}</td>
                        {isAdmin() && (
                          <td className="py-4 px-4">
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
                                className="px-2 py-1 text-tealColor11"
                              >
                                <i className="fa-solid fa-pen"></i>
                              </button>
                            )}
                          </td>
                        )}
                        {isAdmin() && (
                          <td className="py-4 px-4">
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
                              className="px-2 py-1 text-red-600 disabled:opacity-50"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">
                Không có thành viên trong nhóm này.
              </p>
            )}

            <button
              onClick={toggleSearch}
              className={`mt-6 px-4 py-2 ml-10 my-4 font-medium rounded-md ${
                showSearch
                  ? 'bg-red-600 text-white hover:bg-red-500'
                  : 'bg-tealColor11 text-white hover:bg-teal-600'
              }`}
            >
              {showSearch ? 'Đóng' : 'Thêm thành viên'}
            </button>

            {showSearch && (
              <div className="my-6 px-32 pb-20 w-2/3 bg-openForm rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-700 mb-4">
                  Tìm kiếm người dùng
                </h2>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  placeholder="Nhập tên người dùng..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-tealCustom"
                />
                {searchQuery && searchResults.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-700 my-2 mb-">
                      Kết quả tìm kiếm
                    </h3>
                    <table className="w-full text-left border border-gray-300 bg-white rounded-xl shadow-md">
                      <thead>
                        <tr className="text-black border-b-2 rounded-xl bg-gray-200 border-tealCustom">
                          <th className="py-4 px-4">ID</th>
                          <th className="py-4 px-4">Họ tên</th>
                          <th className="py-4 px-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResults.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-200">
                            <td className="py-4 px-4">{user.id}</td>
                            <td className="py-4 px-4">{user.fullname}</td>
                            <td className="py-4 px-4">
                              <button
                                onClick={() =>
                                  handleAddMember(groupId, user.id)
                                }
                                className="px-3 py-1 bg-tealColor11 text-white rounded-md hover:bg-teal-600"
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
          </div>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
        <div className="mt-10">
          <GroupBill userId={userId} groupId={groupId} />
        </div>
      </div>
    </div>
  );
};
export default GroupDetail;
