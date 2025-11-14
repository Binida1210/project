import { BooleanField, Datagrid, DateField, List, NumberField, TextField } from 'react-admin';

export const TransactionList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" label="ID" />
      <TextField source="warehouse.name" label="Warehouse" />
      <TextField source="owner.name" label="Owner" />
      <TextField source="renter.name" label="Renter" />
      <NumberField source="price" label="Price (VND)" />
      <NumberField source="duration" label="Duration (months)" />
      <DateField source="createdAt" label="Created At" showTime={true} textAlign="right" />
      {/* <BooleanField source="isConfirmed" label="Confirmed" /> */}
      <NumberField className="color-success" source="fee" label="Fee (VND)" />
    </Datagrid>
  </List>
);
