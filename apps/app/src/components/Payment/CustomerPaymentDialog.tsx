import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { stripePromise } from '@/libs';

import { ConfirmDialog, ConfirmDialogProps } from '../Common/Dialog';

const Error = styled.div`
  color: red;
  margin-top: 12px;
`;

export type CustomerPaymentDialogHelpers = {
  setSecretClient: (secretClient: string) => void;
  handlePayment: () => void;
};

export type CustomerPaymentDialogProps = Omit<ConfirmDialogProps, 'onAccept'> & {
  clientSecret?: string | (() => Promise<string>);
  onSucceed?: () => void;
  onAcceptPay?: (helpers: CustomerPaymentDialogHelpers) => void;
};

export function CustomerPaymentDialog(props: CustomerPaymentDialogProps) {
  const { onSucceed, onAcceptPay, children, clientSecret, title = 'Xác nhận thanh toán', ...dialogProps } = props;

  const [message, setMessage] = useState<string>('');
  const [isLoading, setLoading] = useState(false);
  const [isResponded, setResponded] = useState(false);
  const clientSecretRef = useRef<string>();

  useEffect(() => {
    setResponded(false);
    setMessage('');
    if (typeof clientSecret === 'function') {
      setLoading(true);
      clientSecret().then((data) => {
        console.log(data);

        clientSecretRef.current = data;
        setLoading(false);
      });
    } else {
      clientSecretRef.current = clientSecret;
    }
  }, [clientSecret]);

  const handleSubmit = async () => {
    const stripe = await stripePromise;

    if (!stripe || !clientSecretRef.current) {
      return;
    }

    setLoading(true);

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecretRef.current);

    console.log(paymentIntent, error);

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

  return (
    <ConfirmDialog
      {...dialogProps}
      acceptText="Thanh toán"
      fallback={<div>{message}</div>}
      loading={isLoading}
      showFallback={isResponded}
      title={title}
      onAccept={() => {
        onAcceptPay?.({
          handlePayment: handleSubmit,
          setSecretClient: (clientSecret) => (clientSecretRef.current = clientSecret),
        });
      }}
    >
      <div>
        <div>
          {children}
          {message && <Error id="payment-message">{message}</Error>}
        </div>
      </div>
    </ConfirmDialog>
  );
}

