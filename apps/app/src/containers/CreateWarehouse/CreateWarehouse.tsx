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

// Page wrapper for the 'create warehouse' flow.
// Uses CreateWarehouseProvider to host the Formik form and provide the submit handler.
export const CreateWarehouse = () => {
  const createWarehouseFormRef = useRef<FormikProps<CreateWarehouseFormValuesType>>(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Submit handler: prepare payload, call API and navigate to listing on success.
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
        void 0;
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
  justify-content: center;
  align-items: center;
  gap: var(--space-1);
  padding-top: 0.375rem;

  @media (max-width: 900px) {
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
  margin: 2rem 0 1rem 0;
  width: 100%;
  text-align: center;
`;
