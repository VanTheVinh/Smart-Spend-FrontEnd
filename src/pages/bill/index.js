import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import AddBillModal from '../../components/bill/addBill';
import UpdateBillModal from '../../components/bill/updateBill';
import DeleteBillModal from '../../components/bill/deteleBill';
import BudgetUpdate from '~/components/user/BudgetUpdate';
import { getBills } from '~/services/billService';
import { getCategoryByUserId } from '~/services/categoryService';
import '@fortawesome/fontawesome-free/css/all.min.css';

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
  const [showDropdown, setShowDropdown] = useState(false);
  const [budget, setBudget] = useState(null);
  

  const userID = userId;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchBillsData = async () => {
    try {
      let billData = [];
      if (groupId) {
        billData = await getBills({ group_id: groupId });
        billData = billData.filter((bill) => bill.is_group_bill);
      } else {
        billData = await getBills({ user_id: userID });
        billData = billData.filter(
          (bill) =>
            !bill.is_group_bill && Number(bill.user_id) === Number(userID),
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
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, groupId]);

  useEffect(() => {
    if (bills.length > 0) {
      fetchCategoryNames();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bills, userId]);

  // const handleDropdownToggle = () => {
  //   setShowDropdown(!showDropdown);
  // };

  const handleEdit = (bill) => {
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
    <div className="flex flex-col justify-center mx-20">
      <div className="p-10 min-h-screen">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-3xl text-center font-bold mt-3">DANH SÁCH HÓA ĐƠN</h3>

          <div className="flex justify-between mb-4">
            <div className="flex justify-start mb-6">
              <AddBillModal onBillAdded={fetchBillsData} groupId={groupId} />
            </div>
            {/* Bộ lọc */}
            <div className="my-4 space-x-4 text-gray-600">
              <i class="fa-solid fa-filter"></i>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="ALL">Tất cả</option>
                <option value="THU">Thu nhập</option>
                <option value="CHI">Chi tiêu</option>
              </select>

              {/* Lọc theo số tiền */}
              <i class="fa-solid fa-filter-circle-dollar"></i>
              <select
                value={amountSortOrder}
                onChange={(e) => toggleAmountSortOrder(e.target.value)}
              >
                <option value="default">Mặc định</option>
                <option value="asc">Tăng dần</option>
                <option value="desc">Giảm dần</option>
              </select>
            </div>
          </div>

          {/* Danh sách hóa đơn */}
          {filteredBills.length === 0 ? (
            <p className="text-center text-gray-600">No bills found.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow-lg">
              <table className="min-w-full border-collapse text-center bg-white shadow-md">
                <thead>
                  <tr className="text-black border-b-2 bg-tealFirsttd border-tealCustom">
                    <th className="py-4 px-4">Type</th>
                    <th className="py-4 px-4">Amount</th>
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Description</th>
                    <th className="py-4 px-4">Created By</th>
                    <th className="py-4 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((bill, index) => (
                    <tr
                      key={bill.id}
                      className={index % 2 === 1 ? 'bg-tdOdd' : 'bg-white'}
                    >
                      <td>
                        {bill.type === 'THU' ? (
                          <FontAwesomeIcon
                            icon={faChevronUp}
                            className="text-teal-700"
                          />
                        ) : bill.type === 'CHI' ? (
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            className="text-red-600"
                          />
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="py-4 px-4">{bill.amount}</td>
                      <td className="py-4 px-4">{bill.date}</td>
                      <td className="py-4 px-4">
                        {categoryNames[bill.category_id] || 'Loading...'}
                      </td>
                      <td className="py-4 px-4">{bill.description}</td>
                      <td className="py-4 px-4">{bill.user_id}</td>
                      <td className="py-4 px-4 relative">
                        <button
                          onClick={() => handleEdit(bill)}
                          className="mr-6 px-2 py-1 text-tealEdit"
                        >
                          <i className="fa-solid fa-pen"></i>{' '}
                          {/* Pencil icon */}
                        </button>
                        <button
                          onClick={() => handleDelete(bill)}
                          className="px-2 py-1 text-red-600"
                        >
                          <i className="fa-solid fa-trash-can"></i>{' '}
                          {/* Trash can icon */}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modals */}
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
    </div>
  );
};

export default BillList;
