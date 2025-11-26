import { Stripe } from '@stripe/stripe-js';

import { stripePromise } from '@/libs';

export type ConfirmPaymentResult = {
  message?: string;
  error?: string;
};

export class PaymentService {
  private stripe: Stripe | null = null;

  constructor() {
    stripePromise.then((stripe) => (this.stripe = stripe));
  }

  async confirmPayment(clientSecret: string): Promise<ConfirmPaymentResult> {
    if (!this.stripe || !clientSecret) {
      throw new Error('stripe or client secret is invalid');
    }

    const { paymentIntent, error } = await this.stripe.confirmCardPayment(clientSecret);

    console.log(paymentIntent, error);

    switch (error?.type) {
      case undefined:
        break;
      case 'card_error':
      case 'validation_error':
        return { error: error.message };
      default:
        break;
    }

    switch (paymentIntent?.status) {
      case undefined:
        return {};
      case 'succeeded':
        return { message: 'Thanh toán thành công!' };
      case 'processing':
        return { message: 'Your payment is processing.' };
      case 'requires_payment_method':
        return { message: 'Your payment was not successful, please try again.' };
      default:
        return { message: 'Something went wrong.' };
    }
  }
}

export default new PaymentService();

