/* eslint-disable */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button as BaseButton } from '@/components/Common/Button/Button';
import { Loading } from '@/components/Fallback';

import { privateApi } from '../../axios/axios';
import { useAuthStore } from '../../auth';
import { AuthenticateResponse } from '../../auth/models';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [authenticate] = useAuthStore((state) => [state.authenticate]);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  // available email check func
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // check email form
    if (!isValidEmail(email)) {
      setError('Email không hợp lệ.');
      return;
    }

    setLoading(true);
    privateApi
      .post<AuthenticateResponse>('auth/login', { Email: email, Password: password })
      .then(({ data, status }) => {
        if (status === 200) {
          const { jwtToken, id, name, role } = data;
          authenticate({ token: jwtToken, user: { id, name, role } });
          navigate('/home');
        } else {
          setLoading(false);
        }
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 401) {
            setError('Email hoặc mật khẩu không đúng.');
          } else if (e.response.status === 500) {
            setError('Lỗi hệ thống, vui lòng thử lại sau.');
          } else {
            setError('Đăng nhập thất bại, vui lòng thử lại.');
          }
        } else {
          setError('Không thể kết nối tới máy chủ.');
        }
        setLoading(false);
      });
  };

  return (
    <PagePadding>
      <FormContainer>
        <h2>Login</h2>
        <Form onSubmit={handleSubmit}>
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <Error>
              <p>{error}</p>
            </Error>
          )}
          <PrimaryButton disabled={isLoading} type="submit">
            {isLoading ? <Loading size={25} /> : 'Login'}
          </PrimaryButton>
        </Form>
      </FormContainer>
    </PagePadding>
  );
};

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// wrapper used as a classed div to provide page-level vertical padding
const PagePadding = styled.div.attrs({ className: 'page-padding' })`
  padding: 8rem 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  width: 200px;
  border: 1px solid gray;
  border-radius: 5px;
`;

const PrimaryButton = styled(BaseButton)`
  width: 140px;
  /* inherits standardized height, radius, font styling */
`;

const Error = styled.div`
  margin-top: 5px;
  color: red;
  font-style: italic;
  font-size: 0.8rem;

  p {
    margin: 0;
  }
`;
