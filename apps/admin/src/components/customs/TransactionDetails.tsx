import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Confirm, useRedirect } from 'react-admin';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { apiUrl } from '../../provider';

type RentedInfo = {
  renterId?: string | number;
  rentedDate?: string;
  endDate?: string;
  contractBase64?: string;
};

type TransactionDetailsRecord = {
  id: number;
  name: string;
  userId: string | number;
  price: number;
  createdDate: string;
  rented: boolean;
  rentedInfo?: RentedInfo | null;
};

export const TransactionDetails = () => {
  const { id } = useParams();
  const redirect = useRedirect();
  const [data, setData] = useState<TransactionDetailsRecord | null>(null);
  const [isContractOpen, setContractOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    axios
      .post<TransactionDetailsRecord>(`${apiUrl}/warehouse/static/${id}`, {
        includes: ['RentedWarehouses', 'Comments', 'Comments.User', 'Images'],
      })
      .then(({ data: response }) => {
        if (!response) {
          setData(null);
          return;
        }

        setData({
          ...response,
          rentedInfo: response.rentedInfo ?? null,
        });
      });
  }, [id]);

  if (!data) {
    return null;
  }
  return (
    <>
      <Wrapper>
        <Header>
            <h1>Warehouse details</h1>
            <Button
              label="Back"
            onClick={() => {
              redirect('/warehouse');
            }}
          />
        </Header>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Warehouse</InfoLabel>
            <InfoValue>{data.name}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Owner</InfoLabel>
            <InfoValue>{data.userId}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Renter</InfoLabel>
            <InfoValue>{data.rentedInfo?.renterId ?? 'Not rented'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Price</InfoLabel>
            <InfoValue>{(data.price * 1000).toLocaleString('en-US')} VND</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Rent date</InfoLabel>
            <InfoValue>{data.rentedInfo?.rentedDate ?? 'Not rented'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>End date</InfoLabel>
            <InfoValue>{data.rentedInfo?.endDate ?? 'Not rented'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Created</InfoLabel>
            <InfoValue>{data.createdDate}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Status</InfoLabel>
            <InfoValue>{data.rented ? 'Rented' : 'Not rented'}</InfoValue>
          </InfoItem>
        </InfoGrid>

        {data.rentedInfo ? (
          <ContractCard>
            <ContractHeader>
              <SectionTitle>Rental contract</SectionTitle>
              <ButtonRow>
                <Button label="View contract" onClick={() => setContractOpen(true)} />
              </ButtonRow>
            </ContractHeader>
          </ContractCard>
        ) : null}
      </Wrapper>
      {data.rentedInfo ? (
        <Confirm
          confirm="Close"
          content={
            <ContractContent>
              <ContractFrame
                src={`data:application/pdf;base64,${data.rentedInfo?.contractBase64 ?? ''}`}
                title="Hợp đồng thuê"
              />
            </ContractContent>
          }
          isOpen={isContractOpen}
          maxWidth={false}
          scroll="body"
                title="Contract"
          onClose={() => {
            setContractOpen(false);
          }}
          onConfirm={() => setContractOpen(false)}
        />
      ) : null}
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  margin-top: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--admin-space-2);
  flex-wrap: wrap;

  h1 {
    margin: 0;
    font-size: 1.125rem;
  }

  button {
    padding: 0.5rem 1rem !important;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: clamp(0.75rem, 1.5vw, 1.125rem);
  padding: clamp(0.75rem, 2.3vw, 1.5rem);
  border-radius: var(--admin-radius-lg);
  background: var(--admin-surface);
  border: 1px solid var(--admin-border-color);
  box-shadow: var(--admin-shadow-soft);
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InfoLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--admin-text-secondary);
`;

const InfoValue = styled.span`
  display: block;
  padding: 9px 11px;
  border-radius: 9px;
  background: var(--admin-surface-muted);
  border: 1px solid var(--admin-border-color);
  color: var(--admin-text-primary);
  letter-spacing: 0.01em;
`;

const ContractCard = styled.div`
  padding: clamp(15px, 2.3vw, 24px);
  border-radius: var(--admin-radius-lg);
  background: var(--admin-surface);
  border: 1px solid var(--admin-border-color);
  box-shadow: var(--admin-shadow-soft);
`;

const ContractHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--admin-space-2);
  flex-wrap: wrap;
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--admin-text-primary);
`;

const ButtonRow = styled.div`
  display: flex;
  gap: var(--admin-space-2);

  button {
    padding: 0.5rem 1rem !important;
  }
`;

const ContractContent = styled.div`
  width: min(90vw, 860px);
  height: min(70vh, 560px);
`;

const ContractFrame = styled.embed`
  width: 100%;
  height: 100%;
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
`;
