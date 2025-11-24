import { BooleanField, Datagrid, DateField, List, NumberField, TextField } from 'react-admin';

export const TransactionList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" label="" />
      <TextField source="warehouse.name" label="Tên kho bãi" />
      <TextField source="owner.name" label="Chủ sở hữu" />
      <TextField source="renter.name" label="Người thuê" />
      <NumberField source="price" label="Giá (VND)" />
      <NumberField source="duration" label="Thời hạn (tháng)" />
      <DateField source="createdAt" label="Thời gian tạo" showTime={true} textAlign="right" />
      {/* <BooleanField source="isConfirmed" label="Xác nhận" /> */}
      <NumberField className="color-success" source="fee" label="Phí (VND)" />
    </Datagrid>
  </List>
);
