import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { convertDateToLocaleDateFormat } from '@/utils/datetime-format.util';
import { formatPrice } from '@/utils/format-price.util';

type Props = {
  deposit: number;
  remain: number;
  startDate: Date;
  children?: ReactNode;
};

export function PaymentConfirmationContent({ deposit, remain, startDate, children }: Props) {
  return (
    <Wrapper>
      <ContentCard>
        <Header> Xác nhận thanh toán </Header>

        <Body>
          <p>
            Sau khi xác nhận thanh toán, bạn sẽ trả phần tiền cọc là <strong>{formatPrice(deposit)} VND</strong>.
          </p>

          <p>
            Sau đó bạn cần phải thanh toán phần còn lại sau tiền cọc là <strong>{formatPrice(remain)} VND</strong> trước{' '}
            <strong>{convertDateToLocaleDateFormat(startDate)}</strong> để hoàn thành việc thuê kho bãi.
          </p>

          <Note>
            <span>Lưu ý:</span> Nếu như không thanh toán đúng hạn, yêu cầu thuê kho của bạn sẽ bị hủy và sẽ không được
            hoàn lại số tiền đã cọc.
          </Note>

          <ActionsSlot>{children}</ActionsSlot>
        </Body>
      </ContentCard>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const ContentCard = styled.div`
  width: 100%;
  max-width: 560px;
  background: white;
  border-radius: 14px;
  padding: 18px 22px;
`;

const Header = styled.h2`
  margin: 6px 0 12px 0;
  font-size: clamp(1.125rem, 2.2vw, 1.5rem);
  font-weight: 800;
  text-align: center;
`;

const Body = styled.div`
  color: #1f2937; 
  font-size: 0.98rem;
  line-height: 1.45;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Note = styled.p`
  background: #fff8f0;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.92rem;
  color: #374151;

  span {
    font-weight: 700;
    color: #1f2937;
  }
`;

const ActionsSlot = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: center;

  & > button {
    width: 100%;
    max-width: 360px;
    padding: 12px 22px;
    border-radius: 12px;
    background: linear-gradient(90deg, #8b5cf6 0%, #7c4dff 100%);
    color: #fff;

    font-weight: 700;
    font-size: 15px;
    border: none;
    cursor: pointer;
  }

  @media (max-width: 480px) {
    & > button {
      height: 48px;
      font-size: 16px;
    }
  }
`;

