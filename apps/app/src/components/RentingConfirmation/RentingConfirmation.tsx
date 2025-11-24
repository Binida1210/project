import { useFormikContext } from 'formik';
import styled from 'styled-components';

import { WardLabel } from '@/constants/ward-label.constant';
import { RentingState } from '@/containers/RentingForm/RentingFormContent';
import { WardValue } from '@/enums/ward-value.enum';
import { WareHouseModel } from '@/models/warehouse.model';
// date formatting: using toLocaleDateString directly for compact display
import { resolveAddress } from '@/utils/warehouse-address.util';

import { formatPrice } from '../../utils/format-price.util';
import { Carousel } from '../Carousel';
import { RenterInformationFormValuesType } from '../RenterInformation';

type RentingConfirmationProps = {
  warehouse: WareHouseModel;
  rentingState: RentingState;
};

export const RentingConfirmation = (props: RentingConfirmationProps) => {
  const { warehouse, rentingState } = props;
  const {
    values: { duration },
  } = useFormikContext<RenterInformationFormValuesType>();

  const { deposit, confirm: remain, total: totalPrice } = rentingState;

  return (
    <Container className="irent-renting-confirmation">
      <Body>
        <WarehouseContainer>
          <WarehouseContainerInfo>
            <ProductName>{warehouse.name}</ProductName>
            <Address>
              {resolveAddress(warehouse.address) ?? (warehouse.ward === WardValue.ALL ? '' : WardLabel[warehouse.ward])}
            </Address>
            <WarehouseBody className="irent-renting-confirmation__warehouse-body">
              {/* Pairing fields so grid reads: (area ↔ price), (doors ↔ deposit), (floors ↔ remaining), (due date full row) */}
              {/* row 1: area | price */}
              <WarehouseItem>
                <WarehouseBodyLabel>Diện tích</WarehouseBodyLabel>
                <WarehouseBodyData>{warehouse.area} m²</WarehouseBodyData>
              </WarehouseItem>
              <WarehouseItem>
                <WarehouseBodyLabel>Giá</WarehouseBodyLabel>
                <WarehouseBodyData>{formatPrice(totalPrice)} VND</WarehouseBodyData>
              </WarehouseItem>

              {/* row 2: doors | deposit */}
              <WarehouseItem>
                <WarehouseBodyLabel>Cửa</WarehouseBodyLabel>
                <WarehouseBodyData>{warehouse.doors ?? 0}</WarehouseBodyData>
              </WarehouseItem>
              <WarehouseItem>
                <WarehouseBodyLabel>Giá cọc (50%)</WarehouseBodyLabel>
                <WarehouseBodyData>{formatPrice(deposit)} VND</WarehouseBodyData>
              </WarehouseItem>

              {/* row 3: floors | remaining */}
              <WarehouseItem>
                <WarehouseBodyLabel>Tầng</WarehouseBodyLabel>
                <WarehouseBodyData>{warehouse.floors ?? 0}</WarehouseBodyData>
              </WarehouseItem>
              <WarehouseItem>
                <WarehouseBodyLabel>Thanh toán sau cọc</WarehouseBodyLabel>
                <WarehouseBodyData>{formatPrice(remain)} VND</WarehouseBodyData>
              </WarehouseItem>

              {/* row 4: full width = due date */}
              <WarehouseItem full>
                <WarehouseBodyLabel>Hạn thanh toán</WarehouseBodyLabel>
                <WarehouseBodyData>{new Date(rentingState.startDate).toLocaleDateString('vi-VN')}</WarehouseBodyData>
              </WarehouseItem>
            </WarehouseBody>
          </WarehouseContainerInfo>
          <WarehouseContainerImage>
            <StyledCarousel
              images={warehouse.images}
              showFullscreenButton={false}
              showPlayButton={false}
              showThumbnails={false}
            ></StyledCarousel>
          </WarehouseContainerImage>
        </WarehouseContainer>
        <RenterInfoContainer>
          <RenterInfoContainerLeft>
            <Subtitle>Địa chỉ thanh toán</Subtitle>
          </RenterInfoContainerLeft>
          <RenterInfoContainerRight>
            <Subtitle>Phương thức thanh toán</Subtitle>
          </RenterInfoContainerRight>
        </RenterInfoContainer>
      </Body>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin-top: 3rem; /* add requested top spacing for .irent-renting-confirmation */
`;

const Title = styled.h1`
  font-size: 2.25rem; /* bigger page title */
  margin: 0 0 1.25rem 0;
  text-align: center; /* center page title */
  font-weight: 800;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const WarehouseContainer = styled.div`
  border-radius: 0.5rem;
  padding: 1.25rem;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column; /* stacked mobile-first */
  gap: 1rem;
  width: 60dvw;
  max-width: 96%;
  margin: 0 auto;
`;

const WarehouseContainerInfo = styled.div``;

const WarehouseContainerImage = styled.div`
  border-radius: 1rem;
  width: 100%;
  overflow: hidden;
`;
const StyledCarousel = styled(Carousel)`
  width: 100%;
  aspect-ratio: 16/9;
  max-height: 26rem;
  overflow: hidden;
  background-color: #8080806a;

  .image-gallery-content:not(.fullscreen) .image-gallery-image {
    height: 100%;
    width: 100%;
    padding-top: 0;
  }

  .image-gallery-thumbnail-image {
    height: 3.5rem;
    width: auto;
    object-fit: cover;
    object-position: center;
  }
`;

const Subtitle = styled.h4`
  color: gray;
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
`;

const ProductName = styled.h1`
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem; /* prominent inside card */
  font-weight: 800;
  color: #0f1724;
`;

const Address = styled.h4`
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  color: #444;
  font-weight: 600;
`;

const WarehouseBody = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem 1rem;

  /* when used inside the renting confirmation page we want slightly larger horizontal gap */
  &.irent-renting-confirmation__warehouse-body {
    gap: 0.5rem 2rem;
  }

  /* Two-column grid on larger screens so each item can be a single element that sits left/right */
  @media (min-width: 48rem) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const WarehouseItem = styled.div<{ full?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  gap: 1rem;

  /* allow some items to span both columns (eg. due-date row) */
  ${({ full }) => (full ? 'grid-column: 1 / -1;' : '')}
`;

const WarehouseBodyLabel = styled.label`
  display: block;
  padding: 0.5rem 0.5rem 0.5rem 0;
  border-bottom: 1px solid transparent;
  color: #6b6b6b;
  font-size: 0.9rem;
  white-space: nowrap; /* avoid wrapping labels */
`;

const WarehouseBodyData = styled.span`
  display: block;
  padding: 0.5rem 0;
  font-size: 1rem;
  white-space: nowrap; /* keep value on one line */
  overflow: hidden;
  text-overflow: ellipsis; /* if still too long, show ellipsis */
  text-align: right; /* align right inside the item */
`;

const RenterInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 60dvw;
  max-width: 96%;
  margin: 0 auto;
`;

const RenterInfoContainerLeft = styled.div``;

const RenterInfoContainerRight = styled.div``;
