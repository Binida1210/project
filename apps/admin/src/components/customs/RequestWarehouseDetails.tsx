import { blackA, blue } from '@radix-ui/colors';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as stitches from '@stitches/react';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { Button, useRedirect } from 'react-admin';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { apiUrl } from '../../provider';

type WarehouseImage = {
  originalUrl: string;
};

type WarehouseDetailsRecord = {
  id: number;
  name: string;
  address: string;
  price: number;
  area: number;
  floors: number;
  doors: number;
  images: WarehouseImage[];
  description?: string | null;
};

type WarehouseDetailsResponse = WarehouseDetailsRecord & {
  images?: WarehouseImage[];
};

export const RequestWarehouseDetails = () => {
  const { id } = useParams();
  const [warehouse, setWarehouse] = useState<WarehouseDetailsRecord | null>(null);
  const [status, setStatus] = useState<string>('1');
  const [rejectedReason, setRejectedReason] = useState('');
  const redirect = useRedirect();

  const handleUpdateWarehouseRequest = () => {
    axios.patch(`${apiUrl}/warehouse/confirm/${id}`, { status: Number(status), rejectedReason }).then(() => {
      redirect('/request');
    });
  };

  useEffect(() => {
    if (!id) {
      return;
    }

    axios
      .post<WarehouseDetailsResponse>(`${apiUrl}/warehouse/static/${id}`, {
        includes: ['RentedWarehouses', 'Comments', 'Comments.User', 'Images'],
      })
      .then(({ data }) => {
        if (!data) {
          setWarehouse(null);
          return;
        }

        setWarehouse({
          ...data,
          images: Array.isArray(data.images) ? data.images : [],
        });
      });
  }, [id]);

  if (!warehouse) {
    return null;
  }

  // Parse address if it's JSON string
  const getFormattedAddress = (address: string) => {
    try {
      const parsed = typeof address === 'string' ? JSON.parse(address) : address;
      if (parsed && typeof parsed === 'object' && parsed.address) {
        return parsed.address;
      }
      return address;
    } catch {
      return address;
    }
  };

  const infoItems = [
    { label: 'Address', value: getFormattedAddress(warehouse.address) },
    { label: 'Price', value: `${(warehouse.price * 1000).toLocaleString('en-US')} VND / month` },
    { label: 'Area', value: `${warehouse.area} m²` },
    { label: 'Floors', value: `${warehouse.floors}` },
    { label: 'Doors', value: `${warehouse.doors}` },
  ];

  return (
    <>
      <Wrapper>
        <Header>
          <h1>{warehouse.name || ''}</h1>
          <Button label="Back" onClick={() => redirect('/request')} />
        </Header>
        <InfoGrid>
          {infoItems.map(({ label, value }) => (
            <InfoItem key={label}>
              <InfoLabel>{label}</InfoLabel>
              <InfoValue>{value}</InfoValue>
            </InfoItem>
          ))}
          <InfoItem>
            <InfoLabel>Ảnh</InfoLabel>
            <ImageContainer $hasSrc={Boolean(warehouse.images.length)}>
              {warehouse.images.length ? (
                warehouse.images.map((image) => (
                  <ImageLink key={image.originalUrl} href={image.originalUrl} rel="noreferrer" target="_blank">
                    <Image alt={warehouse.name} src={image.originalUrl} />
                  </ImageLink>
                ))
              ) : (
                <Placeholder>No images</Placeholder>
              )}
            </ImageContainer>
          </InfoItem>
        </InfoGrid>

        <DescriptionCard>
          <SectionTitle>Warehouse details</SectionTitle>
          {!isEmpty(warehouse.description) ? (
            <Description dangerouslySetInnerHTML={{ __html: warehouse.description ?? '' }} />
          ) : (
            <Placeholder>No description</Placeholder>
          )}
        </DescriptionCard>

        <UpdateZone>
          <UpdateTitle>Approval</UpdateTitle>
          <RadioGroupRoot
            value={status}
            onValueChange={(nextValue) => {
              setStatus(nextValue);
            }}
          >
            <RadioOption>
              <RadioGroupItem id="approve" value="1">
                <RadioGroupIndicator />
              </RadioGroupItem>
              <Label htmlFor="approve">Approve</Label>
            </RadioOption>

            <RadioOption>
              <RadioGroupItem id="reject" value="2">
                <RadioGroupIndicator />
              </RadioGroupItem>
              <Label htmlFor="reject">Reject</Label>
            </RadioOption>
          </RadioGroupRoot>

          <Textarea
            disabled={status !== '2'}
            placeholder="Enter rejection reason"
            onChange={(event) => {
              setRejectedReason(event.target.value);
            }}
          />

          <ConfirmButton
            onClick={() => {
              if (!status || (status === '2' && !rejectedReason)) {
                return;
              }
              handleUpdateWarehouseRequest();
            }}
          >
            <span>Update</span>
          </ConfirmButton>
        </UpdateZone>
      </Wrapper>
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
  }

  button {
    padding: 0.5rem 1rem !important;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: clamp(0.875rem, 2vw, 1.5rem);
  padding: clamp(1rem, 3vw, 2rem);
  border-radius: var(--admin-radius-lg);
  background: var(--admin-surface);
  border: 2px solid rgba(14, 165, 233, 0.2);
  box-shadow: 0 2px 12px rgba(14, 165, 233, 0.12);
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--admin-space-2);
`;

const InfoLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--admin-primary);
`;

const InfoValue = styled.span`
  display: block;
  padding: 0.75rem 0.875rem;
  border-radius: 0.75rem;
  background: rgba(241, 245, 249, 0.7);
  border: 1px solid rgba(226, 232, 240, 0.8);
  color: var(--admin-text-primary);
  letter-spacing: 0.01em;
`;

const ImageContainer = styled.div<{ $hasSrc?: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 6px;
  ${({ $hasSrc }) => (!$hasSrc ? 'opacity: 0.65;' : '')}
`;

const ImageLink = styled.a`
  display: block;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: border-color 180ms ease;

  &:hover {
    border-color: rgba(14, 165, 233, 0.6);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  object-position: center;
`;

const DescriptionCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: clamp(20px, 3vw, 32px);
  border-radius: var(--admin-radius-lg);
  background: var(--admin-surface);
  border: 2px solid rgba(14, 165, 233, 0.2);
  box-shadow: 0 2px 12px rgba(14, 165, 233, 0.12);
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--admin-primary);
`;

const Description = styled.div`
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 18px;
  background: var(--admin-surface-muted);
  color: var(--admin-text-secondary);
  line-height: 1.6;

  p {
    margin: 0 0 12px;
  }

  p:last-child {
    margin-bottom: 0;
  }
`;

const Placeholder = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(226, 232, 240, 0.4);
  color: var(--admin-text-tertiary);
  font-size: 14px;
`;

const UpdateZone = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 560px;
  padding: clamp(20px, 3vw, 32px);
  border-radius: var(--admin-radius-lg);
  border: 2px solid rgba(14, 165, 233, 0.2);
  background: var(--admin-surface);
  box-shadow: 0 2px 12px rgba(14, 165, 233, 0.12);
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: stretch;
`;

const UpdateTitle = styled.h4`
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  color: var(--admin-primary);
  letter-spacing: 0.02em;
`;

const RadioGroupRoot = stitches.styled(RadioGroup.Root, {
  display: 'flex',
  flexDirection: 'row',
  gap: 28,
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
});

const RadioOption = stitches.styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
});

const RadioGroupItem = stitches.styled(RadioGroup.Item, {
  all: 'unset',
  backgroundColor: '#ffffff',
  width: 24,
  height: 24,
  borderRadius: '50%',
  border: '2px solid rgba(148, 163, 184, 0.7)',
  display: 'grid',
  placeItems: 'center',
  transition: 'border-color 180ms ease',
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  '&:hover': {
    borderColor: 'rgba(37, 99, 235, 0.9)',
  },
  '&:focus': { boxShadow: '0 0 0 5px rgba(59, 130, 246, 0.25)' },
});

const RadioGroupIndicator = stitches.styled(RadioGroup.Indicator, {
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(37, 99, 235, 0.15)',
  '&::after': {
    content: '""',
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: blue.blue10,
  },
});

const Label = stitches.styled('label', {
  color: '#1f2937',
  fontSize: 15,
  fontWeight: 500,
  lineHeight: 1.2,
  paddingLeft: 6,
});

const Textarea = styled.textarea`
  width: 100%;
  min-height: 160px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: var(--admin-surface-muted);
  font-family: inherit;
  font-size: 15px;
  color: var(--admin-text-primary);
  resize: vertical;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    background 160ms ease;

  &:focus {
    outline: none;
    border-color: var(--admin-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
    background: #ffffff;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ConfirmButton = styled(Button)`
  && {
    align-self: center;
    padding: 10px 28px;
    border-radius: 999px;
  }
`;
