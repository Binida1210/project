import { useStripe } from '@stripe/react-stripe-js';
import { PaymentIntent } from '@stripe/stripe-js';
import { useState } from 'react';
import styled from 'styled-components';

import { Button } from '@/components/Common/Button';
import { Spinner } from '@/components/Common/Spinner';

const PayButton = styled(Button)`
  margin-top: 0.75rem;
  width: 100%;
  padding: 0.7rem 1rem;
  font-size: 1rem;
  border-radius: 0.6rem;
`;

const Error = styled.div`
  margin-top: 0.75rem;
  color: #c53030;
  font-size: 0.95rem;
`;

type CustomerCheckoutFormProp = {
  total: number;
  clientSecret: string;
  onSucceed?: (paymentIntent: PaymentIntent) => void;
};

export function CustomerCheckoutForm(props: CustomerCheckoutFormProp) {
  const stripe = useStripe();
  const { clientSecret } = props;

  const [message, setMessage] = useState<string>('');
  const [isLoading, setLoading] = useState(false);
  const [isResponded, setResponded] = useState(false);

  const handleSubmit = async () => {
    if (!stripe) {
      return;
    }

    setLoading(true);

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret);


    switch (error?.type) {
      case undefined:
        break;
      case 'card_error':
      case 'validation_error':
        setMessage(error.message as string);
        break;
      default:
        break;
    }

    switch (paymentIntent?.status) {
      case undefined:
        break;
      case 'succeeded':
        setResponded(true);
        setMessage('Thanh toán thành công!');
        props.onSucceed?.(paymentIntent);
        break;
      case 'processing':
        setResponded(true);
        setMessage('Your payment is processing.');
        break;
      case 'requires_payment_method':
        setResponded(true);
        setMessage('Your payment was not successful, please try again.');
        break;
      default:
        setMessage('Something went wrong.');
        break;
    }

    setLoading(false);
  };

  return (
    <>
      {isResponded ? (
        <div>{message}</div>
      ) : (
        <div className="checkout-form">
          <div id="payment-form">
            <PayButton disabled={isLoading || isResponded || !stripe} onClick={handleSubmit}>
              {isLoading ? <Spinner innerSize={15} outerSize={25}></Spinner> : 'Xác nhận'}
            </PayButton>
            {message && <Error id="payment-message">{message}</Error>}
          </div>
        </div>
      )}
    </>
  );
}

