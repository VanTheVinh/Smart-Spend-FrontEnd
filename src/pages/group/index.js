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
    <div>
      <h1>Quản lý Nhóm</h1>

      <button onClick={() => setIsAddingGroup(true)}>Thêm Nhóm Mới</button>

      <h2>Danh sách nhóm</h2>
      {groups.length > 0 ? (
        <table border="1" style={{ width: '60%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên nhóm</th>
              <th>Số tiền</th>
              <th>Ngày tạo</th>
              <th>Người tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id}>
                <td>{group.id}</td>
                <td>{group.group_name}</td>
                <td>{group.amount}</td>
                <td>{group.created_at}</td>
                <td>{group.created_by}</td>
                <td>
                  <button onClick={() => handleGroupDetail(group.id)}>Chi tiết</button>
                </td>
              </tr>
            ))}

            {isAddingGroup && (
              <tr>
                <td>New</td>
                <td>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Nhập tên nhóm"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Nhập số tiền"
                  />
                </td>
                <td></td>
                <td>
                  <button onClick={handleCreateGroup}>Thêm Nhóm</button>
                  <button onClick={() => setIsAddingGroup(false)}>Đóng</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <p>Không có nhóm nào.</p>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default Group;
