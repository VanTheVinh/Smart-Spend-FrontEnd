import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import debounce from 'lodash/debounce';

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
  }, [groupId]);  // Thêm groupId vào dependencies của useCallback

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
      <h1>Chi tiết nhóm</h1>
      <h3>User ID: {userId}</h3>

      {group && !editingGroup && (
        <div>
          <h3>Tên nhóm: {group.group_name}</h3>
          <p>
            <strong>Trạng thái:</strong> {group.status}
          </p>
          <p>
            <strong>Ngân sách nhóm:</strong> {formatCurrency(group.amount)} đ
          </p>
          <p>
            <strong>Ngân sách thực tế:</strong>{' '}
            {formatCurrency(group.actual_amount)} đ
          </p>
          {isAdmin() && (
            <button onClick={handleEditGroupToggle}>Chỉnh sửa nhóm</button>
          )}
        </div>
      )}

      {editingGroup && (
        <div>
          <h3>Chỉnh sửa thông tin nhóm</h3>
          <label>
            Tên nhóm:
            <input
              type="text"
              name="group_name"
              value={groupDetails.group_name}
              onChange={handleGroupDetailsChange}
            />
          </label>
          <br />
          <label>
            Trạng thái:
            <input
              type="text"
              name="status"
              value={groupDetails.status}
              onChange={handleGroupDetailsChange}
            />
          </label>
          <br />
          <label>
            Ngân sách:
            <input
              type="number"
              name="amount"
              value={groupDetails.amount}
              onChange={handleGroupDetailsChange}
            />
          </label>
          <br />
          <button onClick={handleUpdateGroupDetails}>Lưu</button>
          <button onClick={handleEditGroupToggle}>Hủy</button>
        </div>
      )}

      <h2>Danh sách thành viên</h2>
      {members.length > 0 ? (
        <table border="1" style={{ width: '70%' }}>
          <thead>
            <tr>
              <th>Thành viên</th>
              <th>Ngân sách</th>
              <th>Ngày tham gia</th>
              <th>Trạng thái</th>
              <th>Vai trò</th>
              {isAdmin() && <th>Chỉnh sửa</th>}
              {isAdmin() && <th>Xóa</th>}
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.user_id}>
                <td>{member.full_name}</td>
                <td>
                  {editingMemberId === member.user_id ? (
                    <input
                      type="number"
                      value={memberAmount}
                      onChange={(e) => setMemberAmount(e.target.value)}
                    />
                  ) : (
                    formatCurrency(member.member_amount)
                  )}
                </td>
                <td>{member.joined_at}</td>
                <td>{member.status}</td>
                <td>{member.role}</td>
                {isAdmin() && (
                  <td>
                    {editingMemberId === member.user_id ? (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateMemberAmount(
                              member.user_id,
                              memberAmount,
                            )
                          }
                        >
                          Cập nhật
                        </button>
                        <button onClick={closeEdit}>Đóng</button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingMemberId(member.user_id);
                          setMemberAmount(member.member_amount);
                        }}
                      >
                        Chỉnh sửa
                      </button>
                    )}
                  </td>
                )}

                {isAdmin() && (
                  <td>
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
                      disabled={member.role === 'admin'} // Không cho phép xóa admin
                    >
                      Xóa
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có thành viên trong nhóm này.</p>
      )}

      <button onClick={toggleSearch}>
        {showSearch ? 'Đóng' : 'Thêm thành viên'}
      </button>

      {showSearch && (
        <div>
          <h2>Tìm kiếm người dùng</h2>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Nhập tên người dùng..."
          />
          {searchQuery && searchResults.length > 0 && (
            <div>
              <h3>Kết quả tìm kiếm</h3>
              <table border="1" style={{ width: '70%' }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Họ tên</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.fullname}</td>
                      <td>
                        <button
                          onClick={() => handleAddMember(groupId, user.id)}
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

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Group Bill</h2>
      <GroupBill userId={userId} groupId={groupId} />
    </div>
  );
};

export default GroupDetail;



















// import React, { useState, useEffect, useContext } from 'react';
// import { useParams } from 'react-router-dom';
// import debounce from 'lodash/debounce';

// import {
//   getGroupMembers,
//   getGroupDetail,
//   searchUser,
//   addMember,
//   updateMemberAmount,
//   deleteMember,
//   updateGroupDetail, // API chỉnh sửa thông tin nhóm
// } from '~/services/groupService';
// import { AppContext } from '~/contexts/appContext';
// import GroupBill from '../bill/groupBill';

// const GroupDetail = () => {
//   const { userId } = useContext(AppContext); // Lấy userId từ context
//   const { groupId } = useParams(); // Lấy groupId từ route params
//   const [group, setGroup] = useState(null);
//   const [members, setMembers] = useState([]);
//   const [error, setError] = useState(null);
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showSearch, setShowSearch] = useState(false);
//   const [editingGroup, setEditingGroup] = useState(false); // Trạng thái chỉnh sửa thông tin nhóm
//   const [groupDetails, setGroupDetails] = useState({
//     group_name: '',
//     status: '',
//     amount: '',
//     update_by: Number(userId),
//   });
//   const [editingMemberId, setEditingMemberId] = useState(null);
//   const [memberAmount, setMemberAmount] = useState('');

//   // console.log('userId', userId);

//   const fetchGroupDetail = async () => {
//     try {
//       // console.log('UserId: ', userId);

//       const data = await getGroupDetail(groupId);
//       setGroup(data.group);
//       setGroupDetails({
//         group_name: data.group.group_name,
//         status: data.group.status,
//         amount: data.group.amount,
//         update_by: Number(userId),
//       });
//     } catch (err) {
//       setError('Không thể lấy thông tin nhóm.');
//     }
//   };

//   const fetchMembers = async () => {
//     try {
//       const data = await getGroupMembers({ group_id: groupId });
//       setMembers(data.members);
//     } catch (err) {
//       setError('Không thể lấy thông tin thành viên.');
//     }
//   };

//   useEffect(() => {
//     if (groupId) {
//       fetchGroupDetail();
//       fetchMembers();
//     }
//   }, [userId, groupId]);

//   const handleSearch = async (query) => {
//     if (!query.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     try {
//       const data = await searchUser(query);
//       setSearchResults(data.users);
//     } catch (err) {
//       setError('Không thể tìm kiếm người dùng.');
//     }
//   };

//   const debouncedSearch = debounce((query) => handleSearch(query), 200);

//   const handleInputChange = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);
//     debouncedSearch(query);
//   };

//   const handleAddMember = async (groupId, userId) => {
//     try {
//       const response = await addMember(groupId, userId);
//       fetchMembers();
//       alert(response.message);
//     } catch (err) {
//       setError('Lỗi khi thêm thành viên. Vui lòng thử lại.');
//     }
//   };

//   const handleUpdateMemberAmount = async (memberId, amount) => {
//     try {
//       if (!amount || amount < 0) {
//         setError('Số tiền không hợp lệ.');
//         return;
//       }

//       const response = await updateMemberAmount(
//         groupId,
//         memberId,
//         amount,
//         userId,
//       );
//       fetchGroupDetail();
//       fetchMembers();

//       alert(response.message || 'Cập nhật thành công!');
//       setEditingMemberId(null); // Đóng phần chỉnh sửa sau khi cập nhật
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message || 'Lỗi khi cập nhật số tiền thành viên.';
//       setError(errorMessage);
//     }
//   };

//   const handleDeleteMember = async (memberId) => {
//     try {
//       const response = await deleteMember({
//         group_id: groupId,
//         user_id: memberId,
//         deleted_by: userId,
//       });

//       fetchMembers(); // Tải lại danh sách thành viên sau khi xóa
//       alert(response.message || 'Xóa thành viên thành công!');
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message || 'Lỗi khi xóa thành viên.';
//       setError(errorMessage);
//     }
//   };

//   const toggleSearch = () => {
//     setShowSearch((prev) => !prev);
//     setSearchQuery('');
//     setSearchResults([]);
//   };

//   const handleEditGroupToggle = () => {
//     setEditingGroup((prev) => !prev);
//   };

//   const handleGroupDetailsChange = (e) => {
//     const { name, value } = e.target;
//     setGroupDetails((prevDetails) => ({
//       ...prevDetails,
//       [name]: value,
//     }));
//   };

//   const handleUpdateGroupDetails = async () => {
//     try {
//       const response = await updateGroupDetail(groupId, groupDetails);
//       fetchGroupDetail();
//       alert(response.message || 'Cập nhật thông tin nhóm thành công!');
//       setEditingGroup(false);
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message || 'Lỗi khi cập nhật thông tin nhóm.';
//       setError(errorMessage);
//     }
//   };

//   const formatCurrency = (amount) => {
//     return Number(amount).toLocaleString('vi-VN');
//   };

//   const closeEdit = () => {
//     setEditingMemberId(null); // Đóng phần chỉnh sửa
//     setMemberAmount(''); // Xóa dữ liệu số tiền
//   };

//   const isAdmin = () => {
//     return members.some(
//       (member) =>
//         member.user_id === parseInt(userId) && member.role === 'admin',
//     );
//   };

//   return (
//     <div>
//       <h1>Chi tiết nhóm</h1>
//       <h3>User ID: {userId}</h3>

//       {group && !editingGroup && (
//         <div>
//           <h3>Tên nhóm: {group.group_name}</h3>
//           <p>
//             <strong>Trạng thái:</strong> {group.status}
//           </p>
//           <p>
//             <strong>Ngân sách nhóm:</strong> {formatCurrency(group.amount)} đ
//           </p>
//           <p>
//             <strong>Ngân sách thực tế:</strong>{' '}
//             {formatCurrency(group.actual_amount)} đ
//           </p>
//           {isAdmin() && (
//             <button onClick={handleEditGroupToggle}>Chỉnh sửa nhóm</button>
//           )}
//         </div>
//       )}

//       {editingGroup && (
//         <div>
//           <h3>Chỉnh sửa thông tin nhóm</h3>
//           <label>
//             Tên nhóm:
//             <input
//               type="text"
//               name="group_name"
//               value={groupDetails.group_name}
//               onChange={handleGroupDetailsChange}
//             />
//           </label>
//           <br />
//           <label>
//             Trạng thái:
//             <input
//               type="text"
//               name="status"
//               value={groupDetails.status}
//               onChange={handleGroupDetailsChange}
//             />
//           </label>
//           <br />
//           <label>
//             Ngân sách:
//             <input
//               type="number"
//               name="amount"
//               value={groupDetails.amount}
//               onChange={handleGroupDetailsChange}
//             />
//           </label>
//           <br />
//           <button onClick={handleUpdateGroupDetails}>Lưu</button>
//           <button onClick={handleEditGroupToggle}>Hủy</button>
//         </div>
//       )}

//       <h2>Danh sách thành viên</h2>
//       {members.length > 0 ? (
//         <table border="1" style={{ width: '70%' }}>
//           <thead>
//             <tr>
//               <th>Thành viên</th>
//               <th>Ngân sách</th>
//               <th>Ngày tham gia</th>
//               <th>Trạng thái</th>
//               <th>Vai trò</th>
//               {isAdmin() && <th>Chỉnh sửa</th>}
//               {isAdmin() && <th>Xóa</th>}
//             </tr>
//           </thead>
//           <tbody>
//             {members.map((member) => (
//               <tr key={member.user_id}>
//                 <td>{member.full_name}</td>
//                 <td>
//                   {editingMemberId === member.user_id ? (
//                     <input
//                       type="number"
//                       value={memberAmount}
//                       onChange={(e) => setMemberAmount(e.target.value)}
//                     />
//                   ) : (
//                     formatCurrency(member.member_amount)
//                   )}
//                 </td>
//                 <td>{member.joined_at}</td>
//                 <td>{member.status}</td>
//                 <td>{member.role}</td>
//                 {isAdmin() && (
//                   <td>
//                     {editingMemberId === member.user_id ? (
//                       <>
//                         <button
//                           onClick={() =>
//                             handleUpdateMemberAmount(
//                               member.user_id,
//                               memberAmount,
//                             )
//                           }
//                         >
//                           Cập nhật
//                         </button>
//                         <button onClick={closeEdit}>Đóng</button>
//                       </>
//                     ) : (
//                       <button
//                         onClick={() => {
//                           setEditingMemberId(member.user_id);
//                           setMemberAmount(member.member_amount);
//                         }}
//                       >
//                         Chỉnh sửa
//                       </button>
//                     )}
//                   </td>
//                 )}

//                 {isAdmin() && (
//                   <td>
//                     <button
//                       onClick={() => {
//                         if (
//                           window.confirm(
//                             'Bạn có chắc chắn muốn xóa thành viên này không?',
//                           )
//                         ) {
//                           handleDeleteMember(member.user_id);
//                         }
//                       }}
//                       disabled={member.role === 'admin'} // Không cho phép xóa admin
//                     >
//                       Xóa
//                     </button>
//                   </td>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>Không có thành viên trong nhóm này.</p>
//       )}

//       <button onClick={toggleSearch}>
//         {showSearch ? 'Đóng' : 'Thêm thành viên'}
//       </button>

//       {showSearch && (
//         <div>
//           <h2>Tìm kiếm người dùng</h2>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={handleInputChange}
//             placeholder="Nhập tên người dùng..."
//           />
//           {searchQuery && searchResults.length > 0 && (
//             <div>
//               <h3>Kết quả tìm kiếm</h3>
//               <table border="1" style={{ width: '70%' }}>
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>Họ tên</th>
//                     <th>Hành động</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {searchResults.map((user) => (
//                     <tr key={user.id}>
//                       <td>{user.id}</td>
//                       <td>{user.fullname}</td>
//                       <td>
//                         <button
//                           onClick={() => handleAddMember(groupId, user.id)}
//                         >
//                           Thêm
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <h2>Group Bill</h2>
//       <GroupBill userId={userId} groupId={groupId} />
//     </div>
//   );
// };

// export default GroupDetail;
