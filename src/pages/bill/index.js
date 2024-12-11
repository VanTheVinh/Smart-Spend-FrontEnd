import React, { useEffect, useState } from 'react';

import AddBillModal from '../../components/bill/addBill';
import UpdateBillModal from '../../components/bill/updateBill';
import DeleteBillModal from '../../components/bill/deteleBill';
import { getBills } from '~/services/billService';
import { getCategoryByUserId } from '~/services/categoryService';

const BillList = ({ userId, groupId }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [billToEdit, setBillToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);
  const [categoryNames, setCategoryNames] = useState({});

  const userID = userId;

  // Hàm dùng chung để lấy danh sách hóa đơn
  const fetchBillsData = async () => {
    try {
      let billData = [];
      if (groupId) {
        // Nếu có groupId, lấy hóa đơn theo group_id và lọc các bill có is_group_bill = true
        billData = await getBills({ group_id: groupId });
        billData = billData.filter((bill) => bill.is_group_bill);
      } else {
        // Nếu không có groupId, lấy hóa đơn theo user_id và lọc các bill có is_group_bill = false
        console.log('UserID index:', userID);
        
        billData = await getBills({ user_id: userID });
        billData = billData.filter((bill) => !bill.is_group_bill && Number(bill.user_id) === Number(userID));
      }
      setBills(billData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bills:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchCategoryNames = async () => {
    try {
      // 1. Lấy tất cả user_id từ bills
      const userIds = [...new Set(bills.map((bill) => bill.user_id))]; // Loại bỏ user_id trùng lặp
      // console.log('Unique User IDs:', userIds);
  
      const names = {};
  
      // 2. Gọi getCategoryByUserId cho từng user_id
      for (const userId of userIds) {
        const categories = await getCategoryByUserId(userId); // Gọi API theo từng user_id
        // console.log(`Categories for user_id ${userId}:`, categories);
  
        // 3. Lấy category_name tương ứng với từng bill.category_id
        for (const bill of bills) {
          const category = categories.find((category) => category.id === bill.category_id);
          if (category) {
            names[bill.category_id] = category.category_name;
          }
        }
      }
  
      // 4. Lưu các tên danh mục vào state
      setCategoryNames(names);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  

  // Lấy danh sách hóa đơn ban đầu
  useEffect(() => {
    if (userID) {
      fetchBillsData();
    } else {
      console.log('UserID chưa có');
    }
  }, [userId, groupId]); // Theo dõi sự thay đổi của userId và groupId

  // Lấy tên danh mục từ API sau khi lấy xong danh sách hóa đơn
  useEffect(() => {
    fetchCategoryNames();
    if (bills.length > 0) {
      fetchCategoryNames();
    }
  }, [bills, userId]); // Theo dõi thay đổi của bills và userId

  const handleEdit = (bill) => {
    setBillToEdit(bill);
    setShowUpdateModal(true);
  };

  const handleDelete = (bill) => {
    setBillToDelete(bill);
    setShowDeleteModal(true);
  };

  const handleBillDeleted = (deletedBillId) => {
    setBills((prevBills) => prevBills.filter((bill) => bill.id !== deletedBillId));
  };

  if (loading) {
    return <div>Loading bills...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Bill List</h3>
      {bills.length === 0 ? (
        <p>No bills found.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Category ID</th>
              <th>Category Name</th>
              <th>Description</th>
              <th>Created By</th>
              <th>Group ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.id}</td>
                <td>{bill.type}</td>
                <td>{bill.amount}</td>
                <td>{bill.date}</td>
                <td>{bill.category_id}</td>
                <td>{categoryNames[bill.category_id] || 'Loading...'}</td>
                <td>{bill.description}</td>
                <td>{bill.user_id}</td>
                <td>{bill.group_id}</td>
                <td>
                  <button onClick={() => handleEdit(bill)}>Edit</button>
                  <button onClick={() => handleDelete(bill)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <AddBillModal onBillAdded={fetchBillsData} groupId={groupId} />

      <UpdateBillModal
        isOpen={showUpdateModal}
        onRequestClose={() => setShowUpdateModal(false)}
        billToEdit={billToEdit}
        onBillUpdated={() => {
          fetchBillsData();
          setShowUpdateModal(false);
        }}
      />

      <DeleteBillModal
        isOpen={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
        billToDelete={billToDelete}
        onBillDeleted={handleBillDeleted}
      />
    </div>
  );
};

export default BillList;
