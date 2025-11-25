/* eslint-disable simple-import-sort/imports, import/order */
import { useCallback, useEffect, useState } from 'react';

import { RulerSquareIcon, StackIcon, ViewVerticalIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAuthStore } from '@/auth';
import { Carousel } from '@/components/Carousel';
import { Button } from '@/components/Common/Button/Button';
import { CommentSection } from '@/components/Feedback';
import { MapView } from '@/components/Map';
import { Role } from '@/enums/role.enum';
import { ClientCommentModel, CreateCommentModel } from '@/models/comment.model';
import { WarehouseStatus } from '@/models/warehouse.model';
import warehouseService from '@/service/warehouse-service';
import { formatPrice } from '@/utils/format-price.util';
import {
  resolveAddress,
  resolveLocation,
  buildGeocodeQuery,
  geocodeAddress,
  buildOsmSearchUrl,
  extractProvinceFromAddress,
} from '@/utils/warehouse-address.util';

import { useWarehouseResolver } from '../../resolver/WarehouseResolver';
import { convertTimestampToDate } from '../../utils/convert-timestamp-to-date.util';

// const mockWarehouseDetails: WareHouseModel = {
//   id: 1,
//   name: 'Thien Thai Ho',
//   ward: WardValue.HAI_CHAU,
//   address: '73 Ha Huy Tap, Thanh Khe, Khue My',
//   price: 45,
//   area: 100,
//   createdDate: 1,
//   doorQuantity: 3,
//   floors: 3,
// };

export const WarehouseDetails = () => {
  const { warehouse, id } = useWarehouseResolver();
  const { user } = useAuthStore(({ user }) => ({
    user,
  }));

  const address = resolveAddress(warehouse.address);
  const location = resolveLocation(warehouse.address);
  const province = extractProvinceFromAddress(warehouse.address);
  const [dynamicLocation, setDynamicLocation] = useState<typeof location | undefined>(undefined);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const geocodeQuery = buildGeocodeQuery(warehouse.address);
  const handleTryGeocode = useCallback(async () => {
    if (!geocodeQuery) return;
    setGeoError(null);
    setGeoLoading(true);
    try {
      const loc = await geocodeAddress(geocodeQuery);
      if (loc) {
        setDynamicLocation(loc);
      } else {
        setGeoError('Không tìm thấy vị trí phù hợp.');
      }
    } catch (e) {
      setGeoError('Đã xảy ra lỗi khi tìm vị trí.');
    } finally {
      setGeoLoading(false);
    }
  }, [geocodeQuery]);

  // Tự động thử geocode khi chưa có tọa độ lưu và có địa chỉ hợp lệ
  useEffect(() => {
    if (!location && geocodeQuery && !dynamicLocation && !geoLoading) {
      void handleTryGeocode();
    }
  }, [location, geocodeQuery, dynamicLocation, geoLoading, handleTryGeocode]);
  // Google-based search/directions removed; destination-only map retained

  const navigate = useNavigate();

  const goToRentingForm = () => {
    navigate(`/warehouse/${id}/renting`);
  };

  const handleViewContract = () => {
    navigate('contract');
  };

  const resolveComment = (comment: ClientCommentModel) => {
    if (!user) {
      return Promise.reject(new Error('User is not authenticated'));
    }
    const warehouseId = warehouse.id;
    const userId = user.id;
    const createComment: CreateCommentModel = { userId, warehouseId, ...comment };
    return warehouseService.addComment(userId, warehouseId, createComment);
  };

  useEffect(() => {}, []);

  return (
    <PagePaddingSmall>
      <Container>
        <BodyContainer>
          {/* Make the title the primary H1 and place it at the top of the detail view */}
          <Title>{warehouse?.name}</Title>
          {/* Gallery follows the title so users see the heading first then media */}
          <ImageContainer>
            <Carousel images={warehouse.images} />
          </ImageContainer>
          <Address>
            {address}
            {province ? <ProvinceTag>{province}</ProvinceTag> : null}
          </Address>
          {(location || dynamicLocation) && (
            <MapViewContainer>
              <MapView height="320px" location={location || dynamicLocation} />
            </MapViewContainer>
          )}
          {!location && !dynamicLocation && (
            <MapViewContainer>
              <FallbackBox>
                <p className="text-sm mb-2">Chưa có tọa độ được lưu cho địa chỉ này.</p>
                {geocodeQuery ? (
                  <div>
                    <FallbackActions>
                      {geoLoading ? (
                        <HintText>Đang tự động tìm vị trí từ địa chỉ…</HintText>
                      ) : (
                        <FallbackButton disabled={geoLoading} onClick={handleTryGeocode}>
                          Thử lại tìm vị trí
                        </FallbackButton>
                      )}
                      <ManualLink href={buildOsmSearchUrl(geocodeQuery)} rel="noreferrer" target="_blank">
                        Tra cứu thủ công trên OpenStreetMap
                      </ManualLink>
                    </FallbackActions>
                    {geoError && <ErrorText>{geoError}</ErrorText>}
                    {!geoLoading && !geoError && (
                      <HintText>Đã dùng Photon / Nominatim để tìm vị trí. Ward chỉ là thông tin phụ.</HintText>
                    )}
                  </div>
                ) : (
                  <HintText>Không có địa chỉ hợp lệ để tìm.</HintText>
                )}
              </FallbackBox>
            </MapViewContainer>
          )}
          <Date>Tạo vào lúc: {warehouse?.createdDate ? convertTimestampToDate(warehouse?.createdDate) : ''}</Date>
          <br />
          <ButtonContainer>
            {user?.role === Role.Renter && (
              <ActionButton disabled={warehouse.rented} onClick={goToRentingForm}>
                {warehouse.rented ? 'Đã thuê' : 'Thuê'}
              </ActionButton>
            )}
            {warehouse.rented && <ActionButton onClick={handleViewContract}>Xem hợp đồng</ActionButton>}
          </ButtonContainer>
          {/* Mục "Yêu thích" đã được lược bỏ theo yêu cầu */}
          {/* Slightly more airy spacing for the metrics area */}
          <MetricsContainer>
            <Price title={`${formatPrice(warehouse?.price)} VND`}>{formatPrice(warehouse?.price)} VND</Price>
            <OtherMetrics>
              <OtherMetricItem>
                <RulerSquareIcon color="#999" height={32} width={32} />
                <Text>{warehouse?.area} mét vuông</Text>
              </OtherMetricItem>
              <OtherMetricItem>
                <ViewVerticalIcon color="#999" height={32} width={32} />
                <Text>{warehouse?.doors ?? 0} cửa</Text>
              </OtherMetricItem>
              <OtherMetricItem>
                <StackIcon color="#999" height={32} width={32} />
                <Text>{warehouse?.floors ?? 0} tầng</Text>
              </OtherMetricItem>
            </OtherMetrics>
          </MetricsContainer>
          <SectionLabel>Mô tả kho bãi</SectionLabel>
          {warehouse.description ? (
            <DescriptionContainer>
              <Description dangerouslySetInnerHTML={{ __html: warehouse.description }} />
            </DescriptionContainer>
          ) : (
            <small>
              <i>Không có mô tả gì ở đây cả</i>
            </small>
          )}
          {/* Đã lược bỏ tính năng chỉ đường trực tiếp để tăng độ ổn định.
            Người dùng có thể dùng liên kết trong bản đồ để mở xem chi tiết trên OSM. */}
          {warehouse.status === WarehouseStatus.Accepted && (
            <CommentsContainer>
              <CommentSection data={warehouse.comments} resolveComment={resolveComment} />
            </CommentsContainer>
          )}
        </BodyContainer>
      </Container>
    </PagePaddingSmall>
  );
};

const ImageContainer = styled.div`
  width: 100%;
  /* image gallery lives inside the page content now; remove large auto margins */
  margin: 24px 0 32px; /* increased gap after heading and after gallery */
  padding: 16px 14px; /* slightly increased padding for better breathing room */
  border-radius: 10px;
  background: #f8fafc; /* soft neutral background for the gallery */

  /* Ensure the carousel container adapts within this wrapper and keeps a responsive aspect ratio */
  & > div {
    width: 100%;
    height: auto;
    border-radius: 8px;
    overflow: hidden;
  }

  /* Large screens: keep the gallery centered and give images a larger fixed height so
     they present more prominently. Thumbnails align left and remain visible. */
  @media (min-width: 769px) {
    padding: 18px 22px;

    & > div {
      max-height: 420px; /* prevent overly tall galleries */
    }

    /* react-image-gallery / carousel inner image element */
    .image-gallery-content:not(.fullscreen) .image-gallery-image {
      height: 420px !important;
      object-fit: cover;
      border-radius: 8px;
    }

    /* move thumbnails into a horizontal strip aligned to start and allow horizontal scrolling */
    .image-gallery-thumbnails {
      margin-top: 12px;
      display: flex;
      justify-content: flex-start;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 6px;
    }

    .image-gallery-thumbnail img,
    .image-gallery-thumbnail-image {
      border-radius: 6px;
      height: 66px;
      width: auto;
      object-fit: cover;
    }
  }

  /* small thumbnail container alignment */
  .image-gallery-thumbnails {
    margin-top: 12px;
    display: flex;
    justify-content: center;
  }
`;

const BodyContainer = styled.div`
  position: relative;
  max-width: 1180px;
  margin: 32px auto 72px; /* slightly more space above and below content */
  padding: 12px 20px 48px; /* a bit more inner padding for larger screens */
`;

const Title = styled.h1`
  margin: 8px 0 6px; /* slight top spacing, sits above the carousel */
  font-size: clamp(1.25rem, 2.6vw, 1.8rem);
  line-height: 1.1;
  color: #0f172a;
`;

const Address = styled.h4``;
const ProvinceTag = styled.small`
  color: #64748b;
  font-weight: normal;
  /* large screens: show a preceding separator dot inline */
  &::before {
    content: ' · ';
    display: inline;
    margin-left: 6px;
  }

  /* at small / tablet breakpoint (<= 768px) we place province on its own line and remove the dot */
  @media (max-width: 768px) {
    display: block;
    margin-top: 6px;
    &::before {
      content: '';
    }
  }
`;

/* Removed unused MapViewContainer styled component */

const Date = styled.span`
  color: #6b7280;
  font-size: 0.95rem;
  display: inline-block;
  margin-top: 6px;
`;

/* Removed unused DirectionText styled component */

/* IconActions/Yêu thích đã xóa */

const MetricsContainer = styled.div`
  display: flex;
  margin-top: 18px;
  padding: 18px 20px;
  border-top: 1px solid #e6e6e9;
  border-bottom: 1px solid #e6e6e9;
  justify-content: space-between;
  align-items: center;
  gap: 14px;

  @media (max-width: 860px) {
    /* stack vertically on narrower screens */
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const CommentsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Price = styled.span`
  font-weight: 800;
  /* single-line price, responsive sizing */
  font-size: clamp(1rem, 3.2vw, 1.75rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 8px; /* extra spacing after price as requested */
`;

const OtherMetrics = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: 860px) {
    justify-content: space-between;
  }
`;

const OtherMetricItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  svg {
    width: 34px;
    height: 34px;
  }

  span {
    margin-top: 8px;
    display: block;
    font-size: 0.95rem;
  }
`;

const Text = styled.span``;

const Container = styled.div``;

// wrapper used to provide page-level vertical padding (2rem) for warehouse details
const PagePaddingSmall = styled.div.attrs({ className: 'page-padding' })`
  padding: 2rem 0;
`;

const MapViewContainer = styled.div`
  margin-top: 16px;
  margin-bottom: 14px;
  width: 100%;
  /* Ensure consistent radius wrapper */
  & > div {
    width: 100%;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  text-align: right;
  cursor: pointer;
`;

// Unify action button size with comment section button
const ActionButton = styled(Button)`
  height: 38px;
  border-radius: 12px;
  min-width: 140px;
  padding: 0 16px;
`;

/* Google-based directions/search UI removed */

const DescriptionContainer = styled.div`
  margin-top: 18px;
  margin-bottom: 40px; /* slightly more breathing room before comments */
  max-width: 100%;
`;

const Description = styled.div`
  padding: 18px 20px;
  border: 1px solid #e6e6e9;
  border-radius: 10px;
  background: #ffffff;
  color: #0f172a;
  font-size: clamp(0.95rem, 1.5vw, 1.125rem);
  line-height: 1.6;
  word-break: break-word;
  text-align: left;
  min-height: 56px;

  p {
    margin: 0 0 10px;
  }
`;

const FallbackBox = styled.div`
  padding: 16px;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  background: #f8fafc;
`;

const FallbackActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const FallbackButton = styled(Button)`
  height: 32px;
  border-radius: 8px;
  padding: 0 12px;
`;

const ManualLink = styled.a`
  font-size: 13px;
  color: #6d28d9;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorText = styled.p`
  margin-top: 8px;
  color: #dc2626;
  font-size: 12px;
`;

const HintText = styled.p`
  margin-top: 8px;
  color: #64748b;
  font-size: 12px;
`;

const SectionLabel = styled.h4`
  margin: 28px 0 18px;
  font-size: clamp(1.05rem, 1.8vw, 1.25rem);
  color: #0f172a;
  letter-spacing: 0.1px;
`;
