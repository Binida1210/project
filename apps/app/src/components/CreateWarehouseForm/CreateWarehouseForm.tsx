/* eslint-disable simple-import-sort/imports, import/order */
import 'react-quill/dist/quill.snow.css';
import './style.css';

import { Field, Form, useFormikContext } from 'formik';
import { Button } from '@/components/Common/Button';
import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { extractLatLngFromText as extractLatLngFromFreeText } from '@/utils/warehouse-address.util';

import { UploadImageButton } from '@/containers/UploadImageButton/UploadImageButton';

import { FieldError } from '../Common/Form';
import { RichTextEditor } from '../Common/RichTextEditor';
import { SuffixInput } from '../Common/SuffixInput';
import { CreateWarehouseFormValuesType } from './CreateWarehouseProvider';

export const CreateWarehouseForm = () => {
  // Using Formik context: parent provider manages validation/submit state.
  // We read handlers & values from Formik so this component focuses on rendering fields only.
  const { handleSubmit, handleChange, handleBlur, values, setFieldValue } =
    useFormikContext<CreateWarehouseFormValuesType>();

  // Track small-screen state to switch the rich editor to a lightweight textarea
  // (react-quill can be heavy / cramped on tiny screens). This keeps the UX responsive.
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 630 : false,
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 630);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <Container>
      <Form className="create-warehouse-form" onSubmit={handleSubmit}>
        <Body>
          <ImageInfo>
            <Text>Ảnh</Text>
            <ImageInputContainer>
              {/* UploadImageButton returns an array of images; bind it directly to Formik */}
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
                    // Keep the free-form mapSearch field and also extract coordinates
                    // when a user pastes 'lat, lng' so we store a structured payload in 'address'.
                    handleChange(e);
                    const raw = e.target.value || '';
                    const coords = extractLatLngFromFreeText(raw);
                    const payload = coords ? JSON.stringify({ address: raw, position: coords }) : raw; // keep plain string if no coords
                    setFieldValue('address', payload);
                  }}
                />
                <FieldError errorFor={'address'} />
              </FormField>

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
            <RightSide></RightSide>
          </TextInfo>

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
          <DescriptionField>
            <Label>Mô tả</Label>
            <EditorWrapper>
              {/* RichTextEditor on desktop, simple textarea fallback on mobile to keep editing lightweight */}
              {isMobile ? (
                <Field as={MobileTextarea} name="description" rows={6} />
              ) : (
                <Field component={RichTextEditor} name="description" />
              )}
            </EditorWrapper>
            <FieldError errorFor={'description'} />
          </DescriptionField>

          <SubmitContainer>
            <Button size="lg" type="submit">
              Hoàn thành
            </Button>
          </SubmitContainer>
        </Body>
      </Form>
    </Container>
  );
};

const Body = styled.div``;

const TextInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  margin-bottom: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const ImageInfo = styled.div`
  margin-bottom: 12px;
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
`;

const RightSide = styled.div`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  padding: 12px 8px;

  & .create-warehouse-form {
    padding-top: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media (min-width: 769px) {
    padding: 0;
  }

  & .create-warehouse-form input,
  & .create-warehouse-form textarea,
  & .create-warehouse-form .ql-container {
    width: 60dvw;
    max-width: 100%;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: 8px;

  label {
    margin-bottom: 8px;
    width: 60dvw;
    max-width: 100%;
    text-align: left;
    display: block;
    font-size: 1.2rem;
    font-weight: 700;
    color: #0f172a;
  }

  @media (max-width: 480px) {
    label {
      font-size: 1rem;
    }
  }
`;

const Label = styled.label``;

const inputStyles = css`
  width: 60dvw;
  max-width: 100%;
  height: 50px;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid gray;
  box-sizing: border-box;
`;

const Input = styled.input`
  ${inputStyles}
`;

const StyledSuffixInput = styled(SuffixInput)`
  width: 60dvw;
  max-width: 100%;
`;

const DescriptionField = styled(FormField)`
  margin: 28px 0;
`;

const EditorWrapper = styled.div`
  width: 60dvw;
  max-width: 100%;
`;

const MobileTextarea = styled.textarea`
  display: block;
  width: min(60dvw, 720px);
  max-width: 100%;
  min-height: 120px;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  box-sizing: border-box;
  resize: vertical;
  background: #fff;
`;
const SubmitContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  margin-bottom: 3rem;

  @media (max-width: 900px) {
    justify-content: center;
  }
`;

const ImageInputContainer = styled.div``;

const Text = styled.span`
  display: block;
  width: 60dvw;
  max-width: 100%;
  text-align: left;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 8px;
`;
