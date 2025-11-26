import { Elements } from '@stripe/react-stripe-js';
import { Appearance, PaymentIntent, StripeElementsOptions } from '@stripe/stripe-js';
import { useFormikContext } from 'formik';
import { isEmpty, mapValues } from 'lodash';
import moment from 'moment';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAuthStore } from '@/auth';
import { api } from '@/axios/axios';
import { Dialog } from '@/components/Common/Dialog';
import {
  Stepper,
  StepperBackButton,
  StepperContentRenderer,
  StepperItemType,
  StepperNextButton,
  StepperProgression,
} from '@/components/Common/Stepper';
import { ContractConfirmation } from '@/components/ContractConfirmation';
import { PaymentConfirmationContent } from '@/components/Payment/PaymentConfirmationContent';
import { RenterInformationFormValuesType, RentingInformationForm } from '@/components/RenterInformation';
import { RentingConfirmation } from '@/components/RentingConfirmation';
import { stripePromise } from '@/libs';
import { CreateRentedWarehouseModel } from '@/models/rented-warehouse.model';
import { useRentingWarehouseResolver } from '@/resolver';
import { calculateRentingWarehousePrices } from '@/utils/calculate-renting-warehouse-prices';
import { generateContractHash } from '@/utils/encrypt';
import { getAllRentingInfoDates } from '@/utils/rented-warehouse.util';

import { CustomerCheckoutForm } from './CustomerCheckoutForm';

export type RentingState = {
  price: number;
  total: number;
  deposit: number;
  confirm: number;
  startDate: Date;
  endDate: Date;
  rentedDate: Date;
  duration: number;
  key: string;
  hash: string;
};

export function RentingFormContent() {
  const { user } = useAuthStore();
  const { warehouse, owner, renter } = useRentingWarehouseResolver();

  const { values, validateForm, errors } = useFormikContext<RenterInformationFormValuesType>();

  const [isStepperCanNext, setStepperCanNext] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const calculateRentingState = useCallback(() => {
    const price = warehouse.price;
    const duration = values.duration;
    const startDate = values.startDate;
    const prices = calculateRentingWarehousePrices(price, duration);
    const dates = mapValues(getAllRentingInfoDates(startDate, duration), (date) => date.toDate());
    const { hash, key } = generateContractHash({
      renterId: renter.id,
      warehouseId: warehouse.id,
      rentedDate: dates.rentedDate,
    });

    return { ...prices, ...dates, price, duration, key, hash };
  }, [values, warehouse, renter]);

  const [rentingState, setRentingState] = useState<RentingState>(calculateRentingState);

  useEffect(() => {
    setRentingState(calculateRentingState());
  }, [calculateRentingState]);

  const dialogContentRef = useRef<ReactNode>(null);
  const contractRef = useRef<string>('');

  const rentingConfirmationElement = useMemo(
    () => <RentingConfirmation rentingState={rentingState} warehouse={warehouse} />,
    [warehouse, rentingState],
  );
  const contractConfirmationElement = useMemo(() => {
    const { duration, endDate, startDate, hash } = rentingState;
    return (
      renter &&
      owner && (
        <ContractConfirmation
          contractOptions={{
            code: hash,
            duration,
            endDate,
            startDate,
            owner,
            renter,
            warehouse,
          }}
          getContract={(contract) => {
            contractRef.current = contract;
          }}
          onAgreedChange={setStepperCanNext}
        />
      )
    );
  }, [rentingState, owner, renter, warehouse]);

  const navigate = useNavigate();

  useEffect(() => {
    if (isEmpty(errors)) {
      setStepperCanNext(true);
    } else setStepperCanNext(false);
  }, [errors]);

  const stripeAppearance: Appearance = {
    theme: 'stripe',
    variables: {
      fontFamily: 'GeneralSans-Variable, Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      fontWeightNormal: '500',
    },
  };

  const stepperItems: StepperItemType[] = useMemo(
    () => [
      {
        label: 'Nhập thông tin',
        status: 'active',
        content: <RentingInformationForm />,
      },
      {
        label: 'Xem hợp đồng',
        status: 'default',
        content: contractConfirmationElement,
      },
      {
        label: 'Xác nhận',
        status: 'default',
        content: rentingConfirmationElement,
      },
    ],
    [contractConfirmationElement, rentingConfirmationElement],
  );

  const handleSaveRentedWarehouse = (paymentIntent: PaymentIntent) => {
    if (user) {
      const { startDate, endDate, rentedDate, deposit, confirm, total, hash } = rentingState;

      const rentedWarehouse: CreateRentedWarehouseModel = {
        renterId: user.id,
        warehouseId: warehouse.id,
        rentedDate: moment(rentedDate).format(),
        startDate: moment(startDate).format(),
        endDate: moment(endDate).format(),
        contractBase64: contractRef.current,
        deposit,
        confirm,
        total,
        depositPayment: paymentIntent.id,
        hash,
      };

      api.post('rentedWarehouse', rentedWarehouse).then(() => {
        navigate('/home');
      });
    }
  };

  const handleOnPayment = () => {
    setStepperCanNext(false);
    const { deposit, confirm: remain, startDate } = rentingState;
    api
      .post<{ clientSecret: string }>('/payment/fee', { amount: deposit, ownerId: owner?.id, userId: user?.id })
      .then((response) => {
        const clientSecret = response.data.clientSecret;
        const options: StripeElementsOptions = {
          clientSecret,
          appearance: stripeAppearance,
        };

        dialogContentRef.current = (
          <Elements options={options} stripe={stripePromise}>
            <PaymentConfirmationContent deposit={deposit} remain={remain} startDate={startDate}>
              <CustomerCheckoutForm clientSecret={clientSecret} total={deposit} onSucceed={handleSaveRentedWarehouse} />
            </PaymentConfirmationContent>
          </Elements>
        );

        setPaymentDialogOpen(true);
        setStepperCanNext(true);
      });
  };

  return (
    <div className="irent-renting-form">
      {/* Wrap the whole renting content area to give some vertical breathing room */}
      <ContentWrap>
        <Stepper
          defaultCanNextOnNewStep={false}
          isCanNext={isStepperCanNext}
          items={stepperItems}
          onCanNextChange={setStepperCanNext}
          onComplete={() => handleOnPayment()}
          onStepChange={(step) => {
            if (step === 0) {
              validateForm().then((errors) => {
                setStepperCanNext(isEmpty(errors));
              });
            } else if (step === 2) {
              setStepperCanNext(true);
            }
          }}
        >
          <Header className="irent-renting-header">
            <TextContainer className="irent-renting-header__text">
              <Title className="irent-renting-title">Thuê {warehouse.name}</Title>
              <div className="irent-renting-progression-wrapper">
                <StepperProgression />
              </div>
            </TextContainer>

            {}
          </Header>
          <StepperContentRenderer />
          <ActionsWrap>
            <ButtonContainer className="irent-renting-actions">
              <StepperBackButton className="irent-renting-btn irent-renting-btn--back" color="secondary" />
              <StepperNextButton className="irent-renting-btn irent-renting-btn--next" />
            </ButtonContainer>
          </ActionsWrap>
        </Stepper>
      </ContentWrap>
      <PaymentDialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        {dialogContentRef.current}
      </PaymentDialog>
    </div>
  );
}

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;

  &.irent-renting-header {
    padding: 8px 0;
  }

  width: 100%;

  .irent-renting-progression-wrapper {
    width: 80dvw;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;

  align-self: stretch;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(1.25rem, 2.6vw, 2rem);
  line-height: 1.08;
  font-weight: 800;
  text-align: center;
`;

const PaymentDialog = styled(Dialog)`
  background-color: white;
`;

const ActionsWrap = styled.div`
  width: 60dvw;
  max-width: 96%;
  margin: 1rem auto 0 auto;
`;

const ContentWrap = styled.div`
  padding: 2rem 0; /* give top and bottom padding of 2rem for renting content */
`;
