/* eslint-disable */
import { indigo } from '@radix-ui/colors';
import { Link2Icon } from '@radix-ui/react-icons';
import { Formik, useFormikContext } from 'formik';
import { produce } from 'immer';
import moment from 'moment';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { number, object } from 'yup';
import { Button as BaseButton } from '@/components/Common/Button/Button';

import { api } from '@/axios/axios';
import { useContract } from '@/hooks';
import { CreateExtendRentingModel } from '@/models/rented-warehouse.model';
import { UserModel } from '@/models/user.model';
import { WareHouseModel } from '@/models/warehouse.model';
import paymentService from '@/service/payment-service';
import rentedWarehouseService from '@/service/rented-warehouse-service';
import userService from '@/service/user-service';
import { convertDateToLocaleDateFormat } from '@/utils/datetime-format.util';
import { generateContractHash } from '@/utils/encrypt';
import { formatPrice } from '@/utils/format-price.util';
import { getDuration, getEndDate } from '@/utils/rented-warehouse.util';

import { ConfirmDialogAction, DialogFallback, DialogTitle } from '../Common/Dialog';
import { FieldError } from '../Common/Form';
import { Spinner } from '../Common/Spinner';

export type ExtendActionDialogContentProps = {
  warehouse: WareHouseModel;
};

export type ExtendState = CreateExtendRentingModel & {
  ownerId: number;
  renterId: number;
  startDate: string;
  hash: string;
  key: string;
  openContract?: () => void;
};

export function ExtendActionDialogContent({ warehouse }: ExtendActionDialogContentProps) {
  return (
    <Formik
      validateOnBlur
      initialValues={{ extendDuration: 1 }}
      validationSchema={object().shape({ extendDuration: number().label('Thời gian gia hạn').min(1).required() })}
      onSubmit={() => {}}
    >
      <ExtendActionDialogForm warehouse={warehouse} />
    </Formik>
  );
}

const ExtendActionDialogForm = ({ warehouse }: ExtendActionDialogContentProps) => {
  const { createContract } = useContract();
  const { values, handleBlur, handleChange, errors } = useFormikContext<{ extendDuration: number }>();
  const [renter, setRenter] = useState<UserModel>();
  const [owner, setOwner] = useState<UserModel>();
  const [contractLoading, setContractLoading] = useState(false);

  useEffect(() => {
    if (warehouse.rentedInfo) {
      userService.get(warehouse.userId).then((data) => setOwner(data));
      userService.get(warehouse.rentedInfo.renterId).then((data) => setRenter(data));
    }
  }, [warehouse.id, warehouse.rentedInfo, warehouse.userId]);

  const [extendState, setExtendState] = useState<ExtendState>();

  useEffect(() => {
    const initiateExtendState = (): ExtendState | undefined => {
      if (warehouse.rentedInfo && owner && renter) {
        const { hash, key } = generateContractHash({
          rentedDate: warehouse.rentedInfo.rentedDate,
          renterId: renter.id,
          warehouseId: warehouse.id,
        });
        const ownerId = owner.id;
        const renterId = renter.id;
        const duration = values.extendDuration;
        const oldEndDate = warehouse.rentedInfo.endDate;
        const startDate = moment(warehouse.rentedInfo.startDate).format();
        const newEndDate = getEndDate(moment(oldEndDate).format(), duration).format();
        const extendDate = moment().format();
        const total = values.extendDuration * warehouse.price;

        return {
          ownerId,
          renterId,
          duration,
          extendDate,
          total,
          hash,
          key,
          newContractBase64: '',
          startDate,
          newEndDate,
        };
      }
    };

    if (!extendState) setExtendState(initiateExtendState());
  }, [warehouse, renter, owner, extendState, values.extendDuration]);

  useEffect(() => {
    setExtendState(
      produce((state) => {
        if (state && warehouse.rentedInfo) {
          const oldEndDate = warehouse.rentedInfo.endDate;
          state.duration = values.extendDuration;
          state.total = values.extendDuration * warehouse.price;
          state.newEndDate = getEndDate(moment(oldEndDate).format(), state.duration).format();
        }
      }),
    );
  }, [values, warehouse]);

  const generateContract = async () => {
    if (extendState && owner && renter) {
      const { hash, newEndDate, startDate } = extendState;
      const newDuration = getDuration(startDate, newEndDate);

      const { open, getBase64 } = createContract({
        pdfOptions: { code: hash, duration: newDuration, endDate: newEndDate, owner, renter, startDate, warehouse },
      });

      setContractLoading(true);
      getBase64().then((base64) => {
        setContractLoading(false);
        setExtendState(
          produce((state) => {
            if (state) {
              state.newContractBase64 = base64;
              state.openContract = open;
            }
          }),
        );
      });
    }
  };

  useEffect(() => {
    generateContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extendState?.duration]);

  return (
    <>
      {extendState && (
        <ExtendForm>
          <DialogTitle>Gia hạn</DialogTitle>
          <Field>
            <label htmlFor="extendDuration">Số tháng gia hạn thêm:</label>
            <Input
              id="extendDuration"
              name="extendDuration"
              type="number"
              value={extendState.duration}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </Field>
          <FieldError errorFor="extendDuration" />
          <div>
            <p>
              Số tiền cần thanh toán để gia hạn:{' '}
              <strong>{extendState.duration > 0 ? formatPrice(extendState.total) : 0} VND</strong>
            </p>
            <p>
              Ngày kết thúc hợp đồng sau khi gia hạn:{' '}
              <strong>{convertDateToLocaleDateFormat(extendState.newEndDate, { capital: true })}</strong>
            </p>
            <ViewContractArea>
              <p>Xem trước hợp đồng: </p>
              {contractLoading ? (
                <Spinner />
              ) : (
                <ViewContractLink onClick={extendState.openContract}>
                  Xem hợp đồng <Link2Icon />
                </ViewContractLink>
              )}
            </ViewContractArea>
          </div>
          <ConfirmDialogAction
            acceptDisable={!!errors.extendDuration}
            acceptText="Thanh toán"
            onAccept={({ setLoading, setFallback, setShowFallback }) => {
              const handlePayExtend = async () => {
                setLoading(true);
                const {
                  data: { clientSecret },
                } = await api.post<{ clientSecret: string }>('/payment/fee', {
                  amount: extendState.total,
                  ownerId: extendState.ownerId,
                  userId: extendState.renterId,
                });

                const paymentResult = await paymentService.confirmPayment(clientSecret);

                setLoading(false);
                if (paymentResult) {
                  setFallback(
                    <DialogFallback>
                      <div>{paymentResult.message ?? paymentResult.error}</div>
                    </DialogFallback>,
                  );
                  setShowFallback(true);
                }
                if (paymentResult.message && warehouse.rentedInfo) {
                  rentedWarehouseService.extendRenting(warehouse.rentedInfo.id, extendState);
                }
              };

              handlePayExtend();
            }}
          />
        </ExtendForm>
      )}
    </>
  );
};

const Field = styled.div`
  display: flex;
  gap: 12px;
  justify-content: space-between;
`;

const ExtendForm = styled.div``;

const Input = styled.input`
  & {
    width: 150px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    padding: 0 10px;
    font-size: 13px;
    line-height: 1;
    border: 0;
    box-shadow: 0 0 0 1px ${indigo.indigo7};
    height: 25px;
  }

  &:focus {
    box-shadow: 0 0 0 2px ${indigo.indigo8};
  }

  &:focus-visible {
    outline: 0;
  }
`;

const ViewContractArea = styled.div`
  display: flex;
  gap: 12px;

  P {
    margin: 0;
  }
`;

const ViewContractLink = styled(BaseButton)`
  width: 160px;
  color: ${indigo.indigo11};
  background: ${indigo.indigo4};
  box-shadow: none;
  &:hover:enabled {
    background: ${indigo.indigo5};
  }
  &:active:enabled {
    background: ${indigo.indigo6};
  }
`;

