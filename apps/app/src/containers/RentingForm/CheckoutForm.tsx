import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripePaymentElementOptions } from '@stripe/stripe-js';
import { FormEvent, useState } from 'react';
import styled from 'styled-components';

import { Button } from '@/components/Common/Button';
import { Spinner } from '@/components/Common/Spinner';
import { formatPrice } from '@/utils/format-price.util';

const Title = styled.div`
  margin-bottom: 20px;
`;

const Price = styled.span`
  font-weight: 700;
`;

const PayButton = styled(Button)`
  margin-top: 12px;
  width: calc(100% - 30px);
`;

const Error = styled.div`
  margin-top: 12px;
`;

type CheckoutFormProp = {
  total: number;
  onSucceed?: () => void;
};

export function CheckoutForm(props: CheckoutFormProp) {
  const stripe = useStripe();
  const elements = useElements();
  const { total } = props;

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setLoading] = useState(true);
  const [isResponded, setResponded] = useState(false);

  const handlePaymentReady = () => {
    setLoading(false);
    elements?.getElement('linkAuthentication')?.focus();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // eslint-disable-next-line camelcase
        receipt_email: email,
      },
      redirect: 'if_required',
    });


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
        setMessage('Payment succeeded!');
        props.onSucceed?.();
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

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs',
  };

  return (
    <>
      {isResponded ? (
        <div>{message}</div>
      ) : (
        <div className="checkout-form">
          <Title className="title">
            You have to pay <Price>{formatPrice(total)} VND</Price>
          </Title>
          <form id="payment-form" onSubmit={(e) => handleSubmit(e)}>
            <LinkAuthenticationElement id="link-authentication-element" onChange={(e) => setEmail(e.value.email)} />
            <PaymentElement id="payment-element" options={paymentElementOptions} onReady={handlePaymentReady} />
            <PayButton disabled={isLoading || isResponded || !stripe || !elements}>
              {isLoading ? <Spinner innerSize={15} outerSize={25}></Spinner> : 'Pay now'}
            </PayButton>
            {message && <Error id="payment-message">{message}</Error>}
          </form>
        </div>
      )}
    </>
  );
}

