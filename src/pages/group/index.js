import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createGroup,
  getGroup,
  getGroupMembers,
  deleteGroup,
} from '~/services/groupService';
import { AppContext } from '~/contexts/appContext';
import DeleteGroupModal from './deteleGroup';

const Group = () => {
  const [groupName, setGroupName] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [groups, setGroups] = useState([]);
  const [groupMember, setGroupMember] = useState([]);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
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
            getGroup({ group_id: member.group_id }),
          );
          const groupResponses = await Promise.all(groupPromises);
          const userGroups = groupResponses
            .map((response) => response.groups)
            .flat();
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
  const handleDelete = (group) => {
    setGroupToDelete(group);
    setShowDeleteModal(true);
  };

  const handleGroupDeleted = (deletedGroupId) => {
    setGroups(groups.filter((group) => group.id !== deletedGroupId)); // Remove deleted group from state
    setShowDeleteModal(false); // Close delete modal after delete
    onActionComplete();
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setGroupToDelete(null);
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="p-10 min-h-screen">
        <div className="bg-white p-6 rounded-xl shadow-md px-11">
          <h3 className="text-3xl text-tealColor11 text-center font-bold mb-10">
            DANH SÁCH QUỸ NHÓM
          </h3>

          <div className="flex justify-between mb-4">
            <button
              onClick={() => setIsAddingGroup(true)}
              className="px-4 py-2 bg-tealColor00 text-white rounded-xl hover:bg-teal-600"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>

          {groups.length > 0 ? (
            <div className="overflow-x-auto rounded-xl ">
              <table className="min-w-full text-center bg-white ">
                <thead>
                  <tr className="text-black border-b-2 bg-tealColor06 border-tealColor11">
                    <th className="py-4 px-4">Tên Nhóm</th>
                    <th className="py-4 px-4">Số Tiền</th>
                    <th className="py-4 px-4">Ngày Tạo</th>
                    <th className="py-4 px-4">Người Tạo</th>
                    <th className="py-4 px-4"></th>
                    <th className="py-4 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group, index) => (
                    <tr
                      key={group.id}
                      className={index % 2 === 1 ? 'bg-gray-100' : 'bg-white'}
                    >
                      <td className="py-4 px-4">{group.group_name}</td>
                      <td className="py-4 px-4">{group.amount}</td>
                      <td className="py-4 px-4">{group.created_at}</td>
                      <td className="py-4 px-4 align-middle flex justify-center">
                        <img
                          src={`https://raw.githubusercontent.com/VanTheVinh/avatars-storage-spend-web/main/avatars/avatar_user_${group.user_id}.jpg`}
                          alt={`Avatar of user ${group.user_id}`}
                          className="w-12 h-12 rounded-full border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300 object-cover"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleGroupDetail(group.id)}
                          className="px-2 py-1 text-3xl text-tealColor11 rounded-md"
                        >
                          <i className="fa-solid fa-circle-info"></i>
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleDelete(group.id)}
                          className="px-2 py-1 text-red-600"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-lg text-gray-500">
              Không có nhóm nào.
            </p>
          )}

          {message && (
            <p className="text-center text-tealColor11 mt-4">{message}</p>
          )}

{showDeleteModal && (
            <DeleteGroupModal
              isOpen={showDeleteModal}
              onRequestClose={handleCloseDeleteModal}
              groupToDelete={groupToDelete}
              onGroupDeleted={handleGroupDeleted}
            />
          )}

          {/* Modal for adding a new group */}
          {isAddingGroup && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-10 rounded-lg shadow-md max-w-sm w-full">
                <h2 className="text-2xl text-center font-bold mb-4">
                  Thêm nhóm mới
                </h2>

                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Nhập tên nhóm"
                  className="border rounded-md px-2 py-1 w-full mb-4"
                />

                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Nhập số tiền"
                  className="border rounded-md px-2 py-1 w-full mb-4"
                />

                <div className="flex justify-between">
                  <button
                    onClick={handleCreateGroup}
                    className="px-4 py-2 font-bold bg-tealColor11 text-white rounded-md hover:bg-teal-700"
                  >
                    Thêm nhóm
                  </button>
                  <button
                    onClick={() => setIsAddingGroup(false)}
                    className="px-4 py-2 font-bold bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Group;
