import { BooleanInput, DateInput, Edit, NumberInput, SimpleForm, TextInput } from 'react-admin';

export const TransactionEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput className='w-100' source="warehouse.name" disabled={true} label="Tên kho bãi" />
      <TextInput className='w-100' source="owner.name" disabled={true} label="Chủ sở hữu" />
      <TextInput className='w-100' source="renter.name" disabled={true} label="Người thuê" />
      <NumberInput className='w-100' source="price" disabled={true} label="Giá (VND)" />
      <TextInput className='w-100' source="duration" disabled={true} label="Thời hạn thuê (tháng)" />
      <DateInput className='w-100' source="createdAt" disabled={true} label="Ngày tạo" />
    </SimpleForm>
  </Edit>
);

