import * as yup from 'yup';

import { FormProvider, ProviderProps } from '../Common/Form';

export type CreateWarehouseFormValuesType = {
  name?: string;
  address?: string;
  mapSearch?: string;
  ward?: number;
  area?: number;
  price?: number;
  image?: string;
  floors?: number;
  doors?: number;
  description?: string;
};

const initialFormValues: CreateWarehouseFormValuesType = {
  name: '',
  mapSearch: '123 Võ Văn Kiệt, Phước Mỹ, Sơn Trà, Đà Nẵng 550000, Vietnam',
  address:
    '{"address":"123 Võ Văn Kiệt, Phước Mỹ, Sơn Trà, Đà Nẵng 550000, Vietnam","position":{"lat":16.0627636,"lng":108.2420478},"ward":"Sơn Trà"}',
};

export type CreateWarehouseFormProps = ProviderProps<CreateWarehouseFormValuesType>;

export const CreateWarehouseProvider = ({
  children,
  onFormValidChange,
  innerRef,
  onSubmit,
}: CreateWarehouseFormProps & { onSubmit?: any }) => {
  const CreateWareHouseSchema = yup.object().shape({
    name: yup.string().label('Tên kho bãi').min(2).max(50).required(),
    address: yup.string().label('Địa chỉ').max(200).required(),
    area: yup.number().label('Diện tích').moreThan(0).required(),
    price: yup.number().label('Giá').moreThan(0).required(),
    images: yup
      .array()
      .of(
        yup
          .object()
          .shape({
            originalUrl: yup.string().label('Ảnh gốc kho bãi').required(),
            thumbnailUrl: yup.string().label('Ảnh thumbnail bãi').required(),
          })
          .required(),
      )
      .min(1),
    doors: yup.number().label('Số cửa').required(),
    floors: yup.number().label('Số tầng').required(),
    description: yup.string().label('Mô tả').required(),
  });

  return (
    <FormProvider
      validateOnBlur
      validateOnMount
      initialValues={initialFormValues}
      innerRef={innerRef}
      validationSchema={CreateWareHouseSchema}
      onFormValidChange={onFormValidChange}
      onSubmit={onSubmit ?? ((values, { setSubmitting }) => setSubmitting(false))}
    >
      {children}
    </FormProvider>
  );
};

