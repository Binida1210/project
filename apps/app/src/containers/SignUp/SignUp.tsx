/* eslint-disable */
import {
  CardElement as StripeCardElement,
  Elements as StripeElements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { FormikHelpers } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button as BaseButton } from '@/components/Common/Button/Button';

import { api } from '@/axios/axios';
import { FieldError, FormProvider } from '@/components/Common/Form';
import { Spinner } from '@/components/Common/Spinner';
import { stripePromise } from '@/libs';

import { signUpFormValidateSchema, SignUpFormValues } from './SignUpItem';

const signUpFormInitialValues: SignUpFormValues = {
  name: '',
  address: '',
  email: '',
  password: '',
  confirmPassword: '',
  dob: new Date(),
  ioc: '',
  phoneNumber: '',
  role: 1,
};

export const SignUp = () => {
  return (
    <StripeElements stripe={stripePromise}>
      <SignUpForm />
    </StripeElements>
  );
};

export const SignUpForm = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleOnFormSubmit = async (values: SignUpFormValues, { setFieldError }: FormikHelpers<SignUpFormValues>) => {
    setLoading(true);
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(StripeCardElement);

    if (!cardElement) return;

    const { paymentMethod, error } = await stripe.createPaymentMethod({ element: cardElement });

    if (error) {
      setFieldError('card', error.message);
      setLoading(false);
      return;
    }

    api
      .post('user', { ...values, paymentMethod: paymentMethod.id })
      .then(() => {
        navigate('/login');
      })
      .catch((e) => {
        if (e.response.status === 400) {
          if (e.response.data.errors.Email !== undefined) setFieldError('email', 'Email đã tồn tại');
        } else {
          setFieldError('form', 'Có lỗi xảy ra khi tạo tài khoản mới, xin hãy duyệt kỹ lại thông tin đăng ký');
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <FormProvider
      initialValues={signUpFormInitialValues}
      validationSchema={signUpFormValidateSchema}
      onFormValidChange={() => {}}
      onSubmit={handleOnFormSubmit}
    >
      {({ values, handleSubmit, handleBlur, handleChange, setSubmitting, setFieldValue }) => (
        <PagePaddingSmall>
          <FormContainer>
            <h2>Đăng ký</h2>
            <Form onSubmit={handleSubmit}>
              <Label htmlFor="name">Tên:</Label>
              <Field>
                <Input id="name" placeholder="Tên" type="text" onBlur={handleBlur} onChange={handleChange} />
                <FieldError errorFor="name"></FieldError>
              </Field>
              <Label htmlFor="email">Địa chỉ email:</Label>
              <Field>
                <Input
                  id="email"
                  placeholder="Địa chỉ email"
                  type="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <FieldError errorFor="email"></FieldError>
              </Field>
              <Label htmlFor="ioc">CCCD/CMND:</Label>
              <Field>
                <Input id="ioc" placeholder="CCCD/CMND" type="text" onBlur={handleBlur} onChange={handleChange} />
                <FieldError errorFor="ioc"></FieldError>
              </Field>
              <Label htmlFor="phoneNumber">Số điện thoại:</Label>
              <Field>
                <Input
                  id="phoneNumber"
                  placeholder="Số điện thoại"
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <FieldError errorFor="phoneNumber"></FieldError>
              </Field>
              <Label htmlFor="address">Địa chỉ:</Label>
              <Field>
                <Input id="address" placeholder="Địa chỉ" type="text" onBlur={handleBlur} onChange={handleChange} />
                <FieldError errorFor="address"></FieldError>
              </Field>
              <Label htmlFor="dob">Ngày sinh:</Label>
              <Field>
                <Input id="dob" placeholder="Ngày sinh" type="date" onBlur={handleBlur} onChange={handleChange} />
                <FieldError errorFor="dob"></FieldError>
              </Field>
              <Label htmlFor="password">Mật khẩu:</Label>
              <Field>
                <Input
                  id="password"
                  placeholder="Mật khẩu"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <FieldError errorFor="password"></FieldError>
              </Field>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu:</Label>
              <Field>
                <Input
                  id="confirmPassword"
                  placeholder="Xác nhận mật khẩu"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <FieldError errorFor="confirmPassword"></FieldError>
              </Field>
              <Label htmlFor="card">Thông tin thẻ: </Label>
              <Field>
                <ElementContainer>
                  <StripeCardElement id="card" />
                </ElementContainer>
                <FieldError errorFor="card"></FieldError>
              </Field>

              <RadioButtonContainer>
                <RadioButtonLabel>
                  <RadioButton
                    defaultChecked={values.role === 1}
                    name="role"
                    type="radio"
                    value={1}
                    onChange={() => setFieldValue('role', 1)}
                  />
                  Người thuê
                </RadioButtonLabel>
                <RadioButtonLabel>
                  <RadioButton
                    defaultChecked={values.role === 2}
                    name="role"
                    type="radio"
                    value={2}
                    onChange={() => setFieldValue('role', 2)}
                  />
                  Chủ kho bãi
                </RadioButtonLabel>
              </RadioButtonContainer>
              <PrimaryButton disabled={loading} type="submit">
                {loading ? <Spinner innerSize={20} margin={0} outerSize={25} /> : 'Đăng ký'}
              </PrimaryButton>
              {/* <Button
              type="button"
              onClick={() => {
                setSubmitting(true);
                new Promise((resolve) => {
                  setTimeout(resolve, 10000);
                })
                  .then(() => navigate('/login'))
                  .finally(() => setSubmitting(false));
              }}
            >
              Đi
            </Button> */}
              <FieldError errorFor="all" />
            </Form>
          </FormContainer>
        </PagePaddingSmall>
      )}
    </FormProvider>
  );
};

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// wrapper used to provide page-level vertical padding for register page
const PagePaddingSmall = styled.div.attrs({ className: 'page-padding' })`
  padding: 2rem 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Label = styled.label`
  width: 100%;
  text-align: left;
`;

const Field = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Input = styled.input`
  padding: 10px;
  width: 350px;
  border: 1px solid gray;
  border-radius: 5px;
`;

const RadioButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const RadioButtonLabel = styled.label`
  display: flex;
  align-items: center;
`;

const RadioButton = styled.input``;

const PrimaryButton = styled(BaseButton)`
  width: 140px;
`;

const ElementContainer = styled.div`
  .StripeElement {
    padding: 10px;
    outline: 1px solid gray;
    border-radius: 5px;
  }
  .StripeElement--focus {
    outline: 2px solid black;
  }
`;
