import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGroup, getGroup, getGroupMembers } from '~/services/groupService';
import { AppContext } from '~/contexts/appContext';

const Group = () => {
  const [groupName, setGroupName] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [groups, setGroups] = useState([]);
  const [groupMember, setGroupMember] = useState([]);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const { userId } = useContext(AppContext);
  const navigate = useNavigate();

  const fetchGroupMember = useCallback(async () => {
    try {
      const response = await getGroupMembers({ user_id: userId });
      setGroupMember(response.members);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhóm từ user_id:', error);
      setMessage('Đã xảy ra lỗi khi lấy danh sách nhóm.');
    }
  }, [userId]);

  useEffect(() => {
    fetchGroupMember();
  }, [fetchGroupMember]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (groupMember.length > 0) {
        try {
          const groupPromises = groupMember.map((member) =>
            getGroup({ group_id: member.group_id })
          );
          const groupResponses = await Promise.all(groupPromises);
          const userGroups = groupResponses.map((response) => response.groups).flat();
          setGroups(userGroups);
        } catch (error) {
          console.error('Lỗi khi lấy danh sách nhóm:', error);
          setMessage('Đã xảy ra lỗi khi lấy danh sách nhóm.');
        }
      }
    };

    fetchGroups();
  }, [groupMember]);

  const handleCreateGroup = async () => {
    if (!groupName) {
      setMessage('Vui lòng nhập thông tin tên nhóm.');
      return;
    }

    const groupData = {
      group_name: groupName,
      created_by: userId,
      amount: amount || 0,
    };

    try {
      const response = await createGroup(groupData);
      setMessage(response.message || 'Tạo nhóm thành công.');
      setGroupName('');
      setAmount('');
      setIsAddingGroup(false);
    } catch (error) {
      setMessage('Đã xảy ra lỗi khi tạo nhóm.');
    }
  };

  const handleGroupDetail = (groupId) => {
    navigate(`/group-detail/${groupId}`);
  };

  return (
    <div className="p-10">
      <h3 className="text-3xl text-center font-bold mb-10">QUẢN LÝ NHÓM</h3>

      <div className="ml-20 flex items-start mb-6">
        <button
          onClick={() => setIsAddingGroup(true)}
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
        >
          Thêm Nhóm Mới
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Danh sách nhóm</h2>

      {groups.length > 0 ? (
        <div className="overflow-x-auto p-11 m-9">
          <table className="min-w-full border-collapse text-center bg-white shadow-md">
            <thead>
              <tr className="text-black border-b-2 bg-tealFirsttd border-tealCustom">
                <th className="py-4 px-4">ID</th>
                <th className="py-4 px-4">Tên Nhóm</th>
                <th className="py-4 px-4">Số Tiền</th>
                <th className="py-4 px-4">Ngày Tạo</th>
                <th className="py-4 px-4">Người Tạo</th>
                <th className="py-4 px-4">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group, index) => (
                <tr
                  key={group.id}
                  className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                >
                  <td className="py-4 px-4">{group.id}</td>
                  <td className="py-4 px-4">{group.group_name}</td>
                  <td className="py-4 px-4">{group.amount}</td>
                  <td className="py-4 px-4">{group.created_at}</td>
                  <td className="py-4 px-4">{group.created_by}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleGroupDetail(group.id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Chi Tiết
                    </button>
                  </td>
                </tr>
              ))}

              {isAddingGroup && (
                <tr>
                  <td className="py-4 px-4">New</td>
                  <td className="py-4 px-4">
                    <input
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="Nhập tên nhóm"
                      className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Nhập số tiền"
                      className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td></td>
                  <td></td>
                  <td className="py-4 px-4 flex gap-2">
                    <button
                      onClick={handleCreateGroup}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Thêm
                    </button>
                    <button
                      onClick={() => setIsAddingGroup(false)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Đóng
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-lg text-gray-500">Không có nhóm nào.</p>
      )}

      {message && <p className="text-center text-red-500 mt-4">{message}</p>}
    </div>
  );
};


export default Group;
