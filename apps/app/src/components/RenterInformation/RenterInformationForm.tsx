import { Form, useFormikContext } from 'formik';
import moment from 'moment';
import { useState } from 'react';
import styled from 'styled-components';

import { useWarehouseResolver } from '../../resolver/WarehouseResolver';
import { formatPrice } from '../../utils/format-price.util';
import { DatePicker } from '../Common/DatePicker';
import { FieldError } from '../Common/Form';
import { SuffixInput } from '../Common/SuffixInput';
import { RenterInformationFormValuesType } from './RenterInformationProvider';

export type RenterInformationFormProps = unknown;

export const RentingInformationForm = (props: RenterInformationFormProps) => {
  const [duration, setDuration] = useState(1);
  const {
    warehouse: { price },
  } = useWarehouseResolver();

  const { handleSubmit, handleChange, handleBlur, setFieldValue, values } =
    useFormikContext<RenterInformationFormValuesType>();

  return (
    <Container className="irent-renter-info">
      <Form onSubmit={handleSubmit}>
        <Body>
          <div className="irent-renter-info__price">
            <PriceContainer>Giá thuê: {formatPrice(price)} VND</PriceContainer>
          </div>

          <div className="irent-renter-info__controls">
            <FormField>
              <Label>Thời hạn thuê</Label>
              <SuffixInput
                defaultValue={values.duration}
                min="1"
                name="duration"
                type="number"
                onBlur={handleBlur}
                onChange={(v) => {
                  setDuration(+v.target.value);

                  handleChange(v);
                }}
              />
            </FormField>
            <FieldError errorFor="duration" />
            <FormField>
              <Label>Ngày bắt đầu</Label>
              <DatePicker
                showDisabledMonthNavigation
                dateFormat={'dd/MM/yyyy'}
                maxDate={moment().add(15, 'days').toDate()}
                minDate={moment().add(5, 'days').toDate()}
                name="startDate"
                selected={values.startDate}
                onBlur={handleBlur}
                onChange={(date) => setFieldValue('startDate', date)}
              />
            </FormField>
            <FieldError errorFor="date" />
            <Text className="irent-renter-info__total">Thành tiền: {formatPrice(price * duration)} VND</Text>
          </div>
        </Body>
      </Form>
    </Container>
  );
};

const Container = styled.div``;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem; 

  .irent-renter-info__price {
    padding-top: 3rem;
    width: 60dvw;
    margin: 0 auto;
    display: block;
  }

  .irent-renter-info__controls {
    width: 60dvw;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .irent-renter-info__total {
    font-size: 1.5rem;
    margin: 0.5rem 0;
    font-weight: 600;
  }
`;

const LeftSide = styled.div`
  display: block;
`;

const RightSide = styled.div`
  display: block;
`;

const Title = styled.h1``;

const FormField = styled.div`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }
`;

const Label = styled.label``;

const Input = styled.input`
  padding: 0.9rem;
  border-radius: 0.5rem;
  border: 1px solid gray;
`;

const Text = styled.span`
  font-size: 0.95rem;
`;

const PriceContainer = styled.h3`
  font-size: 1.125rem;
  margin: 0;
  padding: 0.25rem 0;
`;

