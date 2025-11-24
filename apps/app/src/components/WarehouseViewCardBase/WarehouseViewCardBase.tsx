import { blueA, violetDark } from '@radix-ui/colors';
import { HomeIcon, SquareIcon, TimerIcon } from '@radix-ui/react-icons';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { breakpoints } from '@/constants/breakpoints';

import { WareHouseModel, WarehouseStatus } from '@/models/warehouse.model';
import { convertTimestampToDate } from '@/utils/convert-timestamp-to-date.util';
import { formatPrice } from '@/utils/format-price.util';
import { getDuration } from '@/utils/rented-warehouse.util';
import { resolveAddress } from '@/utils/warehouse-address.util';

import { Separator } from '../Common/Separator';
import { MenuCardOptions, MenuCardOptionsProps } from './MenuCardOptions';
import { RentedWarehouseProgress } from './RentedWarehouseProgress';
import { RentingStatusLabel } from './RentingStatusLabel';
import { WarehouseStatusLabel } from './WarehouseStatusLabel';

export type WarehouseViewCardProps = {
  warehouse: WareHouseModel;
  showRentedProgression?: boolean;
  showPrice?: boolean;
  showRentingStatus?: boolean;
  showWarehouseStatus?: boolean;
  showRentedInfo?: boolean;
  className?: string;
  onClick?: (id: number) => void;
  onDoubleClick?: (id: number) => void;
} & MenuCardOptionsProps;

export const WarehouseViewCardBase = ({
  warehouse,
  showRentedProgression = false,
  showPrice = false,
  showRentedInfo = false,
  showRentingStatus = false,
  showWarehouseStatus = false,
  actions,
  className,
  onClick,
  onDoubleClick,
}: WarehouseViewCardProps) => {
  const { id, name, price, area, createdDate, images, rentedInfo } = warehouse;
  const address = resolveAddress(warehouse.address);

  // Show options menu when available
  const renderCardOptions = () => {
    if (actions) return <MenuCardOptions actions={actions} />;
  };

  // Forward single-click events
  const handleCardClick = () => {
    onClick?.(id);
  };

  // Forward double-click events
  const handleCardDoubleClick = () => {
    onDoubleClick?.(id);
  };

  return (
    <CardContainer className={className} onClick={handleCardClick} onDoubleClick={handleCardDoubleClick}>
      {!isEmpty(actions) && renderCardOptions()}
      <ContentArea>
        <CardImage alt="Product" src={images?.[0]?.originalUrl ?? 'https://picsum.photos/seed/picsum/400/300'} />

        <TextContainer>
          <CardName>
            <Link to={`/warehouse/${warehouse.id}`}>{name}</Link>
          </CardName>
          <CardAddress>
            <CardAddressIcon>
              <HomeIcon />
            </CardAddressIcon>
            <AddressText title={address}>{address}</AddressText>
          </CardAddress>
          {showRentingStatus && rentedInfo && <RentingStatusLabel status={rentedInfo.status} />}
          <CardArea>
            <CardAddressIcon>
              <SquareIcon />
            </CardAddressIcon>
            {area} mét vuông
          </CardArea>

          {showWarehouseStatus && (
            <>
              <WarehouseStatusLabel status={warehouse.status}></WarehouseStatusLabel>
              {warehouse.status === WarehouseStatus.Rejected && (
                <>
                  <Separator end={5} start={5} />
                  <RejectedReason>
                    <strong>Lý do từ chối:</strong> {warehouse.rejectedReason}
                  </RejectedReason>
                </>
              )}
            </>
          )}

          {showRentedInfo && rentedInfo && (
            <>
              <Separator />
              <RentedInfoArea>
                <RentedInfoSide>
                  <RentedInfoSection>Tổng giá thuê:</RentedInfoSection>
                  <RentedInfoSection>Thời gian thuê:</RentedInfoSection>
                  <RentedInfoSection>Giá cọc:</RentedInfoSection>
                  <RentedInfoSection>Giá xác nhận thuê:</RentedInfoSection>
                </RentedInfoSide>
                <Separator orientation="vertical" />
                <RentedInfoSide>
                  <RentedInfoSection>{formatPrice(rentedInfo.total)} VND</RentedInfoSection>
                  <RentedInfoSection>{getDuration(rentedInfo.startDate, rentedInfo.endDate)} tháng</RentedInfoSection>
                  <RentedInfoSection>{formatPrice(rentedInfo.deposit)} VND</RentedInfoSection>
                  <RentedInfoSection>{formatPrice(rentedInfo.confirm)} VND</RentedInfoSection>
                </RentedInfoSide>
              </RentedInfoArea>
            </>
          )}
          {showRentedProgression && (
            <RentedWarehouseProgress rentedInfo={warehouse.rentedInfo}></RentedWarehouseProgress>
          )}
          {showPrice && (
            <PriceText color="#008cff" title={`${formatPrice(price)} VND`}>
              {formatPrice(price)} VND
            </PriceText>
          )}
          <CardDate>
            <TimerIcon />
            {convertTimestampToDate(createdDate)}
          </CardDate>
        </TextContainer>
      </ContentArea>
    </CardContainer>
  );
};

const FONT_FAMILY = `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;

const CardContainer = styled.div`
  width: 100%;

  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border: 1px solid ${violetDark.violet10};
  border-radius: 12px;

  position: relative;
  margin: 0 auto;
  transition: transform 0.14s ease;
  isolation: isolate;
  font-family: ${FONT_FAMILY};
  min-height: 360px;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: ${breakpoints.md}) {
    min-height: auto;
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;

  flex: 1 1 auto;
`;

const TextContainer = styled.div`
  --container-padding-top: 1.5625rem;
  padding: var(--container-padding-top) 1.25rem 1.25rem;
  @media (max-width: ${breakpoints.md}) {
    padding: 1rem 0.875rem 0.875rem;
    --container-padding-top: 1.125rem;
  }
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CardArea = styled.span`
  font-size: 0.85rem;
  font-weight: normal;
  margin-top: 0px;
  display: flex;
  align-items: center;
`;

const RentedInfoArea = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: space-between;
`;

const RentedInfoSide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RentedInfoSection = styled.div``;

const CardName = styled.span`
  font-size: 1.125rem;
  @media (min-width: 769px) and (max-width: ${breakpoints.lg}) {
    font-size: 1rem;
  }
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  margin: 8px 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.2;

  & a:hover {
    color: ${blueA.blueA9};
  }
`;

const CardAddress = styled.span`
  display: flex;
  align-items: flex-start;
  color: #505050;

  font-size: clamp(0.85rem, 1.2vw, 0.95rem);
  font-weight: 500;
  margin-top: 4px;
`;

const AddressText = styled.p`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  word-wrap: break-word;
  hyphens: auto;
  line-height: 1.4;

  @media (max-width: ${breakpoints.md}) {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }
`;

const CardAddressIcon = styled.div`
  display: flex;
  margin-right: 8px;
`;

const CardImage = styled.img`
  width: 100%;

  aspect-ratio: 16 / 9;
  width: 100%;
  height: auto;
  padding: 0.25rem;
  border-radius: 12px 12px 0 0px;
  object-fit: cover;
  object-position: center;
  box-sizing: border-box;
  @media (min-width: 769px) and (max-width: ${breakpoints.lg}) {
    aspect-ratio: 16 / 9;
  }
  @media (max-width: ${breakpoints.md}) {
    aspect-ratio: 4 / 3;
    padding: 0.15rem;
  }
`;

const CardDate = styled.span`
  position: absolute;

  top: calc(var(--container-padding-top) - 2px);
  left: 16px;
  transform: translateY(-100%);
  color: #9aa0a6;
  font-size: clamp(0.8rem, 0.9vw, 0.95rem);
  display: flex;
  gap: 6px;
  align-items: center;

  @media (max-width: ${breakpoints.md}) {
    top: calc(var(--container-padding-top) + 2px);
  }
`;

const PriceText = styled.span`
  margin-top: 1.5rem;
  font-weight: 800;

  font-size: clamp(0.95rem, 2.6vw, 1.45rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 100%;
  @media (min-width: 769px) and (max-width: ${breakpoints.lg}) {
    font-size: clamp(1rem, 2.2vw, 1.25rem);
    margin-top: 1rem;
  }
  line-height: 1.05;
  text-align: right;
`;

const RejectedReason = styled.div`
  font-size: 14px;
  word-wrap: break-word;
`;
