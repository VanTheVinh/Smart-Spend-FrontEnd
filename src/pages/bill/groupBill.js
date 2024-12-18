import BillList from '.';

const GroupBill = ({ userId, groupId }) => {

  return (
    <div>
      <BillList
        userId={userId}
        groupId={groupId}
      />
    </div>
  );
};

export default GroupBill;
