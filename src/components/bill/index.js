  import React, { useContext, useEffect, useState } from 'react';
  import { AppContext } from '~/contexts/appContext';
  import AddBillModal from './addBill';
  import UpdateBillModal from './updateBill';
  import DeleteBillModal from './deteleBill';

  const BillList = () => {
    const { userId, categories} = useContext(AppContext);
    const [bills, setBills] = useState([]); // State để lưu danh sách hóa đơn
    const [loading, setLoading] = useState(true); // State để kiểm tra trạng thái loading
    const [error, setError] = useState(null); // State để xử lý lỗi khi gọi API
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [billToEdit, setBillToEdit] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [billToDelete, setBillToDelete] = useState(null);
    // Lấy danh sách hóa đơn từ API
    useEffect(() => {
      if (!userId) return; // Nếu chưa có userId, không thực hiện API request

      const fetchBills = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/get-bills?user_id=${userId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setBills(data); // Lưu dữ liệu hóa đơn vào state bills
          setLoading(false); // Đổi trạng thái loading thành false
        } catch (error) {
          console.error('Error fetching bills:', error);
          setError(error.message); // Lưu thông báo lỗi nếu có
          setLoading(false); // Đổi trạng thái loading thành false
        }
      };

      fetchBills(); // Gọi API khi có userId
    }, [userId]); // Chạy lại khi userId thay đổi

    // Hàm tra cứu tên danh mục dựa trên category_id
    const getCategoryName = (categoryId) => {
      const category = categories.find((cat) => String(cat.id) === String(categoryId));
      return category ? category.category_name : 'Unknown';
    };    

    const handleEdit = (bill) => {
      setBillToEdit(bill);
      setShowUpdateModal(true);
    };
    
    const handleBillUpdated = (updatedBill) => {
      setBills((prevBills) =>
        prevBills.map((bill) => (bill.id === updatedBill.id ? updatedBill : bill))
      );
    };
    
    const handleDelete = (bill) => {
      setBillToDelete(bill);
      setShowDeleteModal(true);
    };
    
    const handleBillDeleted = (deletedBillId) => {
      setBills((prevBills) => prevBills.filter((bill) => bill.id !== deletedBillId));
    };

    if (!categories || categories.length === 0) {
      return <div>Loading categories...</div>;
    }    

    // Hiển thị nếu đang trong trạng thái loading
    if (loading) {
      return <div>Loading bills...</div>;
    }

    // Hiển thị nếu có lỗi
    if (error) {
      return <div>Error: {error}</div>;
    }
    
    return (
      <div>
        <h2>Bill List</h2>
        {bills.length === 0 ? (
          <p>No bills found.</p> // Nếu không có hóa đơn
        ) : (
          <table border="1" cellPadding="10" cellSpacing="0">
            <thead>
              <tr>
                <th>Type</th>
                <th>Source</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Category Name</th>
                <th>Description</th> 
                <th>Id</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.id}>
                  <td>{bill.type}</td>
                  <td>{bill.source}</td>
                  <td>{bill.amount}</td>
                  <td>{bill.date}</td>
                  <td>{getCategoryName(bill.category_id)}</td> {/* Tra cứu tên danh mục từ category_id */}
                  <td>{bill.description}</td>
                  <td>{bill.category_id}</td>
                  <td>
                  <button onClick={() => handleEdit(bill)}>Edit</button>
                  <button onClick={() => handleDelete(bill)}>Delete</button>
                  </td>
                  </tr>
              ))}
            </tbody>
          </table>       
        )}
        {/* AddBillModal */}
        <AddBillModal onBillAdded={(newBill) => setBills((prevBills) => [...prevBills, newBill])} />

        <UpdateBillModal
        isOpen={showUpdateModal}
        onRequestClose={() => setShowUpdateModal(false)}
        billToEdit={billToEdit}
        onBillUpdated={handleBillUpdated}
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
