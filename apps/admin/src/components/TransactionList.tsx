import { BooleanField, Datagrid, DateField, List, NumberField, SimpleList, TextField } from 'react-admin';

export const TransactionList = () => (
  <List>
    <SimpleList
      primaryText={(record: any) => record.warehouse?.name ?? 'Transaction'}
      secondaryText={(record: any) => `${record.price ?? ''} VND`}
      tertiaryText={(record: any) => record.createdAt}
    />
    <div className="desktop-datagrid" aria-hidden>
      <Datagrid rowClick="show">
      <TextField source="id" label="" />
      <TextField source="warehouse.name" label="Warehouse" />
      <TextField source="owner.name" label="Owner" />
      <TextField source="renter.name" label="Renter" />
      <NumberField source="price" label="Price (VND)" />
      <NumberField source="duration" label="Duration (months)" />
      <DateField source="createdAt" label="Created" showTime={true} textAlign="right" />
      {/* <BooleanField source="isConfirmed" label="Confirmed" /> */}
      <NumberField className="color-success" source="fee" label="Fee (VND)" />
      </Datagrid>
    </div>
  </List>
);

