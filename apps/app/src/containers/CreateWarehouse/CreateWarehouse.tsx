import { FormikProps } from 'formik';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAuthStore } from '@/auth';
import {
  Stepper,
  StepperBackButton,
  StepperContentRenderer,
  StepperItemType,
  StepperNextButton,
  StepperProgression,
} from '@/components/Common/Stepper';

import { api } from '../../axios/axios';
import {
  CreateWarehouseForm,
  CreateWarehouseFormValuesType,
  CreateWarehouseProvider,
} from '../../components/CreateWarehouseForm';

export const CreateWarehouse = () => {
  const [stepperCanNext, setStepperCanNext] = useState<boolean>();
  const currentStepRef = useRef<number>();
  const createWarehouseFormRef = useRef<FormikProps<CreateWarehouseFormValuesType>>(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const stepperItems = useMemo<StepperItemType[]>(
    () => [
      {
        label: 'Nhập thông tin',
        status: 'active',
        content: <CreateWarehouseForm />,
      },
      // {
      //   label: 'Điều khoản',
      //   status: 'default',
      //   content: <Privacy onAgreedChange={(value) => setStepperCanNext(value)} />,
      // },
    ],
    [],
  );

  const handleNextButtonClick = (curr: number | undefined) => {};

  return (
    <Container>
      <CreateWarehouseProvider
        innerRef={createWarehouseFormRef}
        onFormValidChange={(payload) => {
          if (currentStepRef.current !== 0) return;
          if (payload.isValid) setStepperCanNext(true);
          else setStepperCanNext(false);
        }}
      >
        <Stepper
          isCanNext={stepperCanNext}
          items={stepperItems}
          onComplete={() => {
            const { current: formikProps } = createWarehouseFormRef;

            if (user) {
              const { ward, ...rest } = formikProps?.values ?? {};
              const warehouse = {
                ...rest,
                ...(typeof ward === 'number' && !Number.isNaN(ward) ? { ward } : {}),
                createdDate: moment().format(),
                userId: user.id,
              };
              api.post(`warehouse/`, warehouse).then(() => {
                navigate('/list');
              });
            }
          }}
          onStepChange={(s) => {
            currentStepRef.current = s;

            if (s === 1) {
              setStepperCanNext(false);
            } else if (s === 0) {
              createWarehouseFormRef.current?.validateForm().then((errors) => {
                setStepperCanNext(isEmpty(errors));
              });
            }
          }}
        >
          <Header>
            <TextContainer>
              <Title>Tạo kho bãi</Title>
              {/* detail text removed to keep header clean */}
            </TextContainer>
            <StepperProgression />
            <ButtonContainer>
              <StepperBackButton color="secondary"></StepperBackButton>
              <StepperNextButton onClick={handleNextButtonClick}></StepperNextButton>
            </ButtonContainer>
          </Header>
          <StepperContentRenderer />
        </Stepper>
      </CreateWarehouseProvider>
    </Container>
  );
};

const Container = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-1); /* create breathing room between title, stepper, and actions */
  padding-top: 0.375rem; /* nudge header content off the top border */

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
  /* improve spacing for mobile */
  @media (max-width: 900px) {
    gap: 8px;
    align-items: flex-start;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: var(--space-1); /* tighter to avoid pushing into stepper */

  @media (max-width: 900px) {
    justify-content: flex-end;
  }
`;

const Title = styled.h1`
  margin: 0;
`;

const Detail = styled.span`
  color: #999;
  margin: 0;
`;
