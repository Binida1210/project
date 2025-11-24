/* eslint-disable simple-import-sort/imports, import/order */
import 'react-quill/dist/quill.snow.css';
import './style.css';

import { Field, Form, useFormikContext } from 'formik';
import { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { extractLatLngFromText as extractLatLngFromFreeText } from '@/utils/warehouse-address.util';

import { UploadImageButton } from '@/containers/UploadImageButton/UploadImageButton';
// import { getWardFromMapWard } from '@/utils/get-ward-from-map.util';

import { FieldError } from '../Common/Form';
import { RichTextEditor } from '../Common/RichTextEditor';
import { SuffixInput } from '../Common/SuffixInput';
// Removed ward selection in favor of province extracted from address
// Removed Google Map search dependencies
import { CreateWarehouseFormValuesType } from './CreateWarehouseProvider';

// Component: form used by create-warehouse flow, contains fields and image uploader
export const CreateWarehouseForm = () => {
  const { handleSubmit, handleChange, handleBlur, values, setFieldValue } =
    useFormikContext<CreateWarehouseFormValuesType>();
  useEffect(() => {}, []);

  return (
    <Container>
      <Form className="create-warehouse-form" onSubmit={handleSubmit}>
        <Body>
          <ImageInfo>
            <Text>Ảnh</Text>
            <ImageInputContainer>
              <UploadImageButton onImageUploaded={(images) => setFieldValue('images', images)} />
            </ImageInputContainer>
            <FieldError errorFor={'images'} />
          </ImageInfo>
          <TextInfo>
            <LeftSide>
              <FormField>
                <Label>Tên kho bãi</Label>
                <Input defaultValue={values.name} name="name" onBlur={handleBlur} onChange={handleChange} />
                <FieldError errorFor={'name'} />
              </FormField>
              <FormField>
                <Label>Địa chỉ</Label>
                <Input
                  defaultValue={values.mapSearch}
                  name="mapSearch"
                  placeholder="Nhập địa chỉ (có thể kèm toạ độ: lat, lng)"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    const raw = e.target.value || '';
                    // Build an address payload that includes coordinates if present
                    const coords = extractLatLngFromFreeText(raw);
                    const payload = coords ? JSON.stringify({ address: raw, position: coords }) : raw; // keep plain string if no coords
                    setFieldValue('address', payload);
                  }}
                />
                <FieldError errorFor={'address'} />
              </FormField>
              {/* Field 'Quận' removed: province is derived from address when needed */}
              <FormField>
                <Label>Diện tích</Label>
                <StyledSuffixInput
                  defaultValue={values.area}
                  name="area"
                  suffix={'m2'}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <FieldError errorFor="area" />
              </FormField>
              <FormField>
                <Label>Số cửa</Label>
                <Input defaultValue={values.doors} name="doors" onBlur={handleBlur} onChange={handleChange} />
                <FieldError errorFor={'doors'} />
              </FormField>
              <FormField>
                <Label>Số tầng</Label>
                <Input defaultValue={values.floors} name="floors" onBlur={handleBlur} onChange={handleChange} />
                <FieldError errorFor={'floors'} />
              </FormField>
            </LeftSide>
            <RightSide>
              <FormField>
                <Label>Giá</Label>
                <StyledSuffixInput
                  defaultValue={values.price}
                  name="price"
                  suffix=".000 VND"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <FieldError errorFor={'price'} />
              </FormField>
              {/* Map search box đã gỡ bỏ trong bản rút gọn này */}
            </RightSide>
          </TextInfo>
          <FormField>
            <Label>Mô tả</Label>
            <Field component={RichTextEditor} name="description" />
            <FieldError errorFor={'description'} />
          </FormField>
        </Body>
      </Form>
    </Container>
  );
};

const Body = styled.div``;

const TextInfo = styled.div`
  display: grid;
  gap: 28px;
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const ImageInfo = styled.div`
  margin-bottom: 12px;
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h2`
  display: none;
`;

const Container = styled.div`
  padding: 12px 8px;

  /* scoped form padding for the create page */
  & .create-warehouse-form {
    padding-top: 3rem;
  }

  @media (min-width: 769px) {
    padding: 0;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;

  margin-bottom: 8px;

  label {
    margin-bottom: 8px;
  }
`;

const Label = styled.label``;

const inputStyles = css`
  height: 50px;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid gray;
  box-sizing: border-box;
`;

const Input = styled.input`
  ${inputStyles}
`;

const StyledSuffixInput = styled(SuffixInput)``;

// Google Map search input removed

const ImageInputContainer = styled.div``;

const Text = styled.span``;

// MapContainer removed
