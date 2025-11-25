/* eslint-disable simple-import-sort/imports, import/order */
import 'react-quill/dist/quill.snow.css';
import './style.css';

import { Field, Form, useFormikContext } from 'formik';
import { Button } from '@/components/Common/Button';
import { useEffect, useState } from 'react';
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
            <RightSide>{/* Right side kept intentionally blank for this simplified layout */}</RightSide>
          </TextInfo>
          {/* move price field below the two-column area so it's stacked and centered */}
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
  grid-template-columns: 1fr; /* single-column layout — fields stack vertically and centered */
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

/* page header handled by parent; Title styling removed */

const Container = styled.div`
  padding: 12px 8px;

  /* scoped form padding for the create page */
  & .create-warehouse-form {
    padding-top: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center; /* center all child fields and controls horizontally */
  }

  @media (min-width: 769px) {
    padding: 0;
  }

  /* ensure editors & inputs respect the requested 60dvw width */
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
  align-items: center; /* center inputs and keep label contained to the same width */

  margin-bottom: 8px;

  label {
    margin-bottom: 8px;
    width: 60dvw;
    max-width: 100%;
    text-align: left; /* put label to the left above input */
    display: block;
    font-size: 1.2rem; /* larger label text (adjusted) */
    font-weight: 700; /* bold */
    color: #0f172a;
  }

  /* keep left alignment on small screens but slightly smaller text */
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

/* special spacing for the description block */
const DescriptionField = styled(FormField)`
  margin: 28px 0;
`;

/* hide the rich text editor on very small screens */
const EditorWrapper = styled.div`
  width: 60dvw;
  max-width: 100%;
`;

/* Desktop/Mobile editor switching handled in React (isMobile) */

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
  margin-bottom: 3rem; /* put final button closer to page bottom */

  @media (max-width: 900px) {
    justify-content: center;
  }
`;

// Google Map search input removed

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

// MapContainer removed
