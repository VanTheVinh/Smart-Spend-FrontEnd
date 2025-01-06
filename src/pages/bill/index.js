import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';

import AddBillModal from '~/components/bill/addBill';
import UpdateBillModal from '~/components/bill/updateBill';
import DeleteBillModal from '~/components/bill/deteleBill';
import { getBills } from '~/services/billService';
import { getCategoryByUserId } from '~/services/categoryService';

const BillList = ({ userId, groupId, onActionComplete, month, year, type }) => {
  const [filterType, setFilterType] = useState('ALL');
  const [amountSortOrder, setAmountSortOrder] = useState('default');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [billToEdit, setBillToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);
  const [categoryNames, setCategoryNames] = useState({});
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBillsData = async () => {
    setLoading(true);
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
      setBills(billData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchCategoryNames = async () => {
    try {
      const userIds = [...new Set(bills.map((bill) => bill.user_id))];
      const names = {};

      for (const userId of userIds) {
        const categoriesData = await getCategoryByUserId(userId);
        for (const bill of bills) {
          const category = categoriesData.find(
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

  function handleEdit(bill) {
    console.log('Edit bill:', bill);
    setBillToEdit(bill);
    setShowUpdateModal(true);
  }

  const handleDelete = (bill) => {
    setBillToDelete(bill);
    setShowDeleteModal(true);
  };

  const handleBillUpdated = () => {
    fetchBillsData();
    setShowUpdateModal(false); // Close update modal after update
    onActionComplete();
  };

  const handleBillDeleted = (deletedBillId) => {
    setBills(bills.filter((bill) => bill.id !== deletedBillId)); // Remove deleted bill from state
    setShowDeleteModal(false); // Close delete modal after delete
    onActionComplete();
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setBillToDelete(null);
  };

  useEffect(() => {
    if (type) {
      setFilterType(type);
    }
  }, [type]);

  const filteredBills = bills
    .filter((bill) => {
      const isTypeMatch =
        filterType === 'ALL' ? true : bill.type === filterType;

      const [ billMonth, billYear] = bill.date.split('-').map(Number);

      const isMonthMatch = Number(month) === billMonth;
      const isYearMatch = Number(year) === billYear;

      return isTypeMatch && isMonthMatch && isYearMatch;
    })
    .sort((a, b) => {
      if (amountSortOrder === 'default') {
        return new Date(a.date) - new Date(b.date);
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
    <div className="flex flex-col justify-center">
      <div className=" min-h-screen">
        <div className="bg-white rounded-xl ">
          <div className="flex justify-between mb-4">
            <div className="flex justify-start h-12 bg-tealColor00">
              <AddBillModal onBillAdded={fetchBillsData} groupId={groupId} />
            </div>
            <div className="my-4 space-x-4 text-gray-600">
              {/* <i className="fa-solid fa-filter"></i>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="ALL">Tất cả</option>
                <option value="THU">Thu nhập</option>
                <option value="CHI">Chi tiêu</option>
              </select> */}

              <i className="fa-solid fa-filter-circle-dollar"></i>
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

          {filteredBills.length === 0 ? (
            <p className="text-center text-gray-600">No bills found.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow-lg">
              <table className="min-w-full text-center bg-white">
                <thead>
                  <tr className="text-black border-b-2 bg-tealColor06 border-tealColor00">
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
                      className={`${
                        index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                      }`}
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
                      <td className="py-4 px-4">
                        <img
                          src={`https://raw.githubusercontent.com/VanTheVinh/avatars-storage-spend-web/main/avatars/avatar_user_${bill.user_id}.jpg`}
                          alt={`Avatar of user ${bill.user_id}`}
                          className="w-12 h-12 rounded-full border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300 object-cover"
                        />
                      </td>

                      <td className="py-4 px-4 relative">
                        <button
                          onClick={() => handleEdit(bill)}
                          className="mr-6 px-2 py-1 text-tealColor00"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(bill)}
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
          )}

          {showUpdateModal && (
            <UpdateBillModal
              isOpen={showUpdateModal}
              onRequestClose={() => setShowUpdateModal(false)}
              billToEdit={billToEdit}
              onBillUpdated={handleBillUpdated}
            />
          )}

          {showDeleteModal && (
            <DeleteBillModal
              isOpen={showDeleteModal}
              onRequestClose={handleCloseDeleteModal}
              billToDelete={billToDelete}
              onBillDeleted={handleBillDeleted}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BillList;
