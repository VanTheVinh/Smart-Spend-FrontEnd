import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import AddBillModal from '../../components/bill/addBill';
import UpdateBillModal from '../../components/bill/updateBill';
import DeleteBillModal from '../../components/bill/deteleBill';
import { getBills } from '~/services/billService';
import { getCategoryByUserId } from '~/services/categoryService';

const BillList = ({ userId, groupId, onActionComplete }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('ALL'); // Lọc theo ALL, THU, hoặc CHI
  // const [sortOrder, setSortOrder] = useState('asc'); // 'asc' (tăng dần) hoặc 'desc' (giảm dần)
  const [amountSortOrder, setAmountSortOrder] = useState('default'); // default, asc, desc
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [billToEdit, setBillToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);
  const [categoryNames, setCategoryNames] = useState({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchBillsData = async () => {
    try {
      let billData = [];
      if (groupId) {
        billData = await getBills({ group_id: groupId });
        billData = billData.filter((bill) => bill.is_group_bill);
      } else {
        billData = await getBills({ user_id: userId });
        billData = billData.filter(
          (bill) =>
            !bill.is_group_bill && Number(bill.user_id) === Number(userId),
        );
      }

      // Sắp xếp theo ngày tăng dần
      billData.sort((a, b) => new Date(a.date) - new Date(b.date));

      setBills(billData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bills:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchCategoryNames = async () => {
    try {
      const userIds = [...new Set(bills.map((bill) => bill.user_id))];
      const names = {};

      for (const userId of userIds) {
        const categories = await getCategoryByUserId(userId);

        for (const bill of bills) {
          const category = categories.find(
            (category) => category.id === bill.category_id,
          );
          if (category) {
            names[bill.category_id] = category.category_name;
          }
        }
      }

      setCategoryNames(names);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBillsData();
    } else {
      console.log('UserID chưa có');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, groupId]);

  useEffect(() => {
    if (bills.length > 0) {
      fetchCategoryNames();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bills, userId]);

  function handleEdit(bill) {
    setBillToEdit(bill);
    setShowUpdateModal(true);
  }

  const handleDelete = (bill) => {
    setBillToDelete(bill);
    setShowDeleteModal(true);
  };

  const handleBillAdded = () => {
    fetchBillsData();
    onActionComplete();
  };

  const handleBillUpdated = () => {
    fetchBillsData();
    setShowUpdateModal(false);
    onActionComplete();
  };

  const handleBillDeleted = (deletedBillId) => {
    setBills((prevBills) =>
      prevBills.filter((bill) => bill.id !== deletedBillId),
    );
    onActionComplete();
  };

  // Lọc và sắp xếp hóa đơn
  const filteredBills = bills
    .filter((bill) => (filterType === 'ALL' ? true : bill.type === filterType))
    .sort((a, b) => {
      if (amountSortOrder === 'default') {
        return new Date(a.date) - new Date(b.date); // Sắp xếp theo ngày nếu là mặc định
      }
      const amountA = a.amount;
      const amountB = b.amount;
      return amountSortOrder === 'asc' ? amountA - amountB : amountB - amountA;
    });

  const toggleAmountSortOrder = (order) => {
    setAmountSortOrder(order);
  };

  if (loading) {
    return <div>Loading bills...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Danh sách hóa đơn</h3>
      
      {/* Bộ lọc */}
      <div>
        <label>Lọc:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="ALL">Tất cả</option>
          <option value="THU">Thu nhập</option>
          <option value="CHI">Chi tiêu</option>
        </select>
  
        {/* Lọc theo số tiền */}
        <label>Lọc theo số tiền:</label>
        <select
          value={amountSortOrder}
          onChange={(e) => toggleAmountSortOrder(e.target.value)}
        >
          <option value="default">Mặc định</option>
          <option value="asc">Tăng dần</option>
          <option value="desc">Giảm dần</option>
        </select>
      </div>

      {filteredBills.length === 0 ? (
        <p>No bills found.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Type</th>
              <th>Category Name</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Date</th>
              <th>Created By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => (
              <tr key={bill.id}>
                <td>
                  {bill.type === 'THU' ? (
                    <FontAwesomeIcon icon={faChevronUp} />
                  ) : bill.type === 'CHI' ? (
                    <FontAwesomeIcon icon={faChevronDown} />
                  ) : (
                    'N/A'
                  )}
                </td>
                <td>{categoryNames[bill.category_id] || 'Loading...'}</td>
                <td>{bill.amount}</td>
                <td>{bill.description}</td>
                <td>{bill.date}</td>
                <td>{bill.user_id}</td>
                <td>
                  <button onClick={() => handleEdit(bill)}>Edit</button>
                  <button onClick={() => handleDelete(bill)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <AddBillModal
        onBillAdded={() => {
          fetchBillsData();
          handleBillAdded();
        }}
        groupId={groupId}
      />

      <UpdateBillModal
        isOpen={showUpdateModal}
        onRequestClose={() => setShowUpdateModal(false)}
        billToEdit={billToEdit}
        onBillUpdated={() => {
          fetchBillsData();
          setShowUpdateModal(false);
          handleBillUpdated();
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
