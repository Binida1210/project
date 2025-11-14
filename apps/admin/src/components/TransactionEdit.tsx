import { BooleanInput, DateInput, Edit, NumberInput, SimpleForm, TextInput } from 'react-admin';

export const TransactionEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput className="w-100" source="warehouse.name" disabled={true} label="Warehouse" />
      <TextInput className="w-100" source="owner.name" disabled={true} label="Owner" />
      <TextInput className="w-100" source="renter.name" disabled={true} label="Renter" />
      <NumberInput className="w-100" source="price" disabled={true} label="Price (VND)" />
      <TextInput className="w-100" source="duration" disabled={true} label="Duration (months)" />
      <DateInput className="w-100" source="createdAt" disabled={true} label="Created At" />
    </SimpleForm>
  </Edit>
);
