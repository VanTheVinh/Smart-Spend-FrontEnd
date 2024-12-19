import React, { useEffect, useState } from 'react';
import AddBillModal from '../../components/bill/addBill';
import UpdateBillModal from '../../components/bill/updateBill';
import DeleteBillModal from '../../components/bill/deteleBill';
import { getBills } from '~/services/billService';
import { getCategoryByUserId } from '~/services/categoryService';
import '@fortawesome/fontawesome-free/css/all.min.css';

const BillList = ({ userId, groupId }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [billToEdit, setBillToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);
  const [categoryNames, setCategoryNames] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);

  const userID = userId;

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
    if (userID) {
      fetchBillsData();
    }
  }, [userId, groupId]);

  useEffect(() => {
    if (bills.length > 0) {
      fetchCategoryNames();
    }
  }, [bills, userId]);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleEdit = (bill) => {
    setBillToEdit(bill);
    setShowUpdateModal(true);
  };

  const handleDelete = (bill) => {
    setBillToDelete(bill);
    setShowDeleteModal(true);
  };

  const handleBillDeleted = (deletedBillId) => {
    setBills((prevBills) =>
      prevBills.filter((bill) => bill.id !== deletedBillId),
    );
  };

  if (loading) {
    return <div>Loading bills...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='flex flex-col justify-center'>
    <div className="p-10 bg-gray-100 min-h-screen">
      {/* Khối User Bill */}
      {/* <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h4 className="text-lg font-semibold mb-2">User Bill</h4>
        <p className="text-sm mb-1">Ngân sách của bạn: 2000000</p>
        <button className="text-teal-500 underline text-sm">Chỉnh sửa ngân sách</button>
      </div> */}
  
      {/* Khối lớn chứa tiêu đề, nút và danh sách hóa đơn */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Tiêu đề */}
        <h3 className="text-3xl text-center font-bold mb-6">DANH SÁCH HÓA ĐƠN</h3>
  
        {/* Nút thêm hóa đơn */}
        <div className="flex justify-start mb-6">
          <AddBillModal onBillAdded={fetchBillsData} groupId={groupId} />
        </div>
  
        {/* Danh sách hóa đơn */}
        {bills.length === 0 ? (
          <p className="text-center text-gray-600">No bills found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-center bg-white shadow-md">
              <thead>
                <tr className="text-black border-b-2 bg-tealFirsttd border-tealCustom">
                  <th className="py-4 px-4">ID</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Description</th>
                  <th className="py-4 px-4">Created By</th>
                  <th className="py-4 px-4">Group ID</th>
                  <th className="py-4 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, index) => (
                  <tr
                    key={bill.id}
                    className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                  >
                    <td className="py-4 px-4">{bill.id}</td>
                    <td className="py-4 px-4">{bill.type}</td>
                    <td className="py-4 px-4">{bill.amount}</td>
                    <td className="py-4 px-4">{bill.date}</td>
                    <td className="py-4 px-4">
                      {categoryNames[bill.category_id] || 'Loading...'}
                    </td>
                    <td className="py-4 px-4">{bill.description}</td>
                    <td className="py-4 px-4">{bill.user_id}</td>
                    <td className="py-4 px-4">{bill.group_id}</td>
                    <td className="py-4 px-4 relative">
                      <button
                        onClick={() => handleEdit(bill)}
                        className="mr-6 px-2 py-1 text-tealEdit rounded-md"
                      >
                        <i className="fa-solid fa-pen"></i> {/* Pencil icon */}
                      </button>
                      <button
                        onClick={() => handleDelete(bill)}
                        className="px-2 py-1 text-red-600 rounded-md"
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
