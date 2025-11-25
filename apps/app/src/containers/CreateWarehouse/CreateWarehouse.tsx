import { FormikProps } from 'formik';
import moment from 'moment';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAuthStore } from '@/auth';

import { api } from '../../axios/axios';
import {
  CreateWarehouseForm,
  CreateWarehouseFormValuesType,
  CreateWarehouseProvider,
} from '../../components/CreateWarehouseForm';

export const CreateWarehouse = () => {
  const createWarehouseFormRef = useRef<FormikProps<CreateWarehouseFormValuesType>>(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // simple onSubmit handler to post the form data then navigate
  const handleSubmit = async (
    values: CreateWarehouseFormValuesType,
    { setSubmitting }: { setSubmitting: (b: boolean) => void },
  ) => {
    setSubmitting(true);

    if (user) {
      try {
        const { ward, ...rest } = values ?? {};
        const warehouse = {
          ...rest,
          ...(typeof ward === 'number' && !Number.isNaN(ward) ? { ward } : {}),
          createdDate: moment().format(),
          userId: user.id,
        };

        await api.post('warehouse/', warehouse);
        navigate('/list');
      } catch {
        // ignore errors for now – simply stop submitting
      } finally {
        setSubmitting(false);
      }
    } else {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <CreateWarehouseProvider innerRef={createWarehouseFormRef} onSubmit={handleSubmit}>
        <Header>
          <TextContainer>
            <Title>Tạo kho bãi</Title>
          </TextContainer>
        </Header>

        <CreateWarehouseForm />
      </CreateWarehouseProvider>
    </Container>
  );
};

const Container = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: center; /* center the title */
  align-items: center;
  gap: var(--space-1);
  padding-top: 0.375rem;

  @media (max-width: 900px) {
    /* stack elements on narrower screens */
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.h1`
  margin: 2rem 0 1rem 0; /* top margin increased to 2rem per request */
  width: 100%;
  text-align: center; /* center the page title */
`;
/* no extra detail text here; header kept intentionally small */
