/* eslint-disable simple-import-sort/imports, import/order */
import { useEffect, useRef, useState } from 'react';
import { CheckCircledIcon, MagnifyingGlassIcon, MobileIcon } from '@radix-ui/react-icons';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import { breakpoints } from '@/constants/breakpoints';

import { Button } from '@/components/Common/Button';
import { PriceRangeSlider } from '@/components/Common/PriceRangeSlider';
import { ProvinceSelect } from '@/components/Common/ProvinceSelect/ProvinceSelect';
import { SelectOption } from '@/models/select-option.model';
import { extractProvinceFromAddress } from '@/utils/warehouse-address.util';
import warehouseService from '@/service/warehouse-service';

import { HomeWarehouseViewCard } from '../../components/HomeWarehouseViewCard/HomeWarehouseViewCard';
import { WareHouseModel, WarehouseStatus } from '../../models/warehouse.model';

// HomeV2: identical logic to Home.tsx but refined layout & styles for strong responsive behaviour
export const HomeV2 = () => {
  const [warehouses, setWarehouses] = useState<WareHouseModel[]>([]);
  const warehouseRef = useRef<WareHouseModel[]>();
  const [priceFilter, setPriceFilter] = useState<[number, number]>();
  const [provinceFilter, setProvinceFilter] = useState<string | undefined>();
  const [provinceOptions, setProvinceOptions] = useState<SelectOption[]>([]);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'area-asc' | 'area-desc'>();

  const handleExploreClick = () => {
    const el = document.getElementById('list');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    warehouseService.getAll().then((data) => {
      if (data && !isEmpty(data)) {
        const filterWarehouses = data.filter((d) => d.status === WarehouseStatus.Accepted && !d.rented);
        warehouseRef.current = filterWarehouses;
        setWarehouses(warehouseRef.current);

        const provinces = new Set<string>();
        filterWarehouses.forEach((w) => {
          const p = extractProvinceFromAddress(w.address);
          if (p) provinces.add(p);
        });
        const opts: SelectOption[] = [
          { label: 'Tất cả', value: '' },
          ...Array.from(provinces)
            .sort()
            .map((p) => ({ label: p, value: p })),
        ];
        setProvinceOptions(opts);
      }
    });
  }, []);

  useEffect(() => {
    if (warehouseRef.current) {
      let filterResult = warehouseRef.current;
      if (priceFilter)
        filterResult = filterResult.filter(
          (warehouse) => warehouse.price >= priceFilter[0] && warehouse.price <= priceFilter[1],
        );
      if (provinceFilter) {
        filterResult = filterResult.filter(
          (warehouse) => extractProvinceFromAddress(warehouse.address) === provinceFilter,
        );
      }

      if (sortBy) {
        const arr = [...filterResult];
        switch (sortBy) {
          case 'price-asc':
            arr.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            arr.sort((a, b) => b.price - a.price);
            break;
          case 'area-asc':
            arr.sort((a, b) => (a.area || 0) - (b.area || 0));
            break;
          case 'area-desc':
            arr.sort((a, b) => (b.area || 0) - (a.area || 0));
            break;
        }
        filterResult = arr;
      }

      setWarehouses(filterResult);
    }
  }, [priceFilter, provinceFilter, sortBy]);

  return (
    <>
      <Main>
        <Hero>
          <HeroTitle>iRent — Tìm kho bãi nhanh, đơn giản</HeroTitle>
          <HeroSubtitle>
            Kết nối chủ kho với doanh nghiệp. Tối giản thao tác, minh bạch giá, hỗ trợ xuyên suốt.
          </HeroSubtitle>

          <SearchBarV2>
            <ProvinceSelect
              options={provinceOptions}
              onSelect={(value: string) => setProvinceFilter(value || undefined)}
            />
            <ActionsCol>
              <PriceWrap className="price-wrap">
                <PriceRangeSlider max={50000} min={100} onInput={(value: [number, number]) => setPriceFilter(value)} />
              </PriceWrap>
              <div className="action-row">
                <ActionButton onClick={handleExploreClick}>Khám phá</ActionButton>
              </div>
            </ActionsCol>
          </SearchBarV2>

          <MetaBarV2>
            <MetaLeft>
              <strong>{warehouses.length}</strong> kết quả phù hợp
            </MetaLeft>
            <MetaActionsRowV2>
              <SortCol>
                <label htmlFor="sort">Sắp xếp:</label>
                <SelectEl
                  id="sort"
                  value={sortBy ?? ''}
                  onChange={(e) => {
                    const v = e.target.value as typeof sortBy | '';
                    setSortBy(v === '' ? undefined : (v as typeof sortBy));
                  }}
                >
                  <option value="">Mặc định</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="area-asc">Diện tích tăng dần</option>
                  <option value="area-desc">Diện tích giảm dần</option>
                </SelectEl>
              </SortCol>
              <ClearButton
                onClick={() => {
                  setProvinceFilter(undefined);
                  setPriceFilter(undefined);
                  setSortBy(undefined);
                }}
              >
                Bỏ lọc
              </ClearButton>
            </MetaActionsRowV2>
          </MetaBarV2>

          <HighlightsV2>
            <HighlightItem>
              <IconBadge>
                <MagnifyingGlassIcon />
              </IconBadge>
              <div>
                <h4>Tìm kiếm thông minh</h4>
                <p>Lọc theo phường, diện tích và giá chỉ trong vài giây.</p>
              </div>
            </HighlightItem>
            <HighlightItem>
              <IconBadge>
                <CheckCircledIcon />
              </IconBadge>
              <div>
                <h4>Minh bạch & tin cậy</h4>
                <p>Kho được duyệt, thông tin rõ ràng, điều khoản sẵn sàng.</p>
              </div>
            </HighlightItem>
            <HighlightItem>
              <IconBadge>
                <MobileIcon />
              </IconBadge>
              <div>
                <h4>Trải nghiệm mượt</h4>
                <p>Giao diện gọn gàng, tập trung nội dung cần thiết.</p>
              </div>
            </HighlightItem>
          </HighlightsV2>
        </Hero>

        <SectionHeader>
          <h3>Kho đang sẵn sàng</h3>
          <span>{warehouses.length} kho bãi</span>
        </SectionHeader>

        <GridContainerV2 id="list">
          {warehouses.map((it) => (
            <HomeWarehouseViewCard key={it.id} warehouse={it}></HomeWarehouseViewCard>
          ))}
        </GridContainerV2>
      </Main>
    </>
  );
};

const RADIUS = 12; // containers/cards
const RADIUS_SM = 8; // small badges/icons

const Main = styled.div`
  width: 100%;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-3) var(--space-2) 5rem;

  @media (max-width: ${breakpoints.lg}) {
    padding: 1rem 0.75rem 3rem;
  }
`;

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
  padding: clamp(1rem, 2.5vw, 1.75rem);
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: ${RADIUS}px;
`;

const HeroTitle = styled.h1`
  margin: 0;
  font-size: clamp(1.5rem, 4.2vw, 2.5rem);
  font-weight: 800;
  color: #1e1b2e;
  letter-spacing: -0.02em;
`;

const HeroSubtitle = styled.p`
  margin: 0;
  color: #374151;
  font-size: clamp(0.95rem, 1.5vw, 1.125rem);
`;

/* tighter responsive search layout */
const SearchBarV2 = styled.div`
  display: grid;
  grid-template-columns: minmax(160px, 360px) 1fr;
  gap: 12px;
  align-items: start;
  width: 100%;

  @media (max-width: ${breakpoints.mdWide}) {
    grid-template-columns: 1fr;
    gap: 10px;
    align-items: stretch;
  }
`;

const ActionsCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;

  .price-wrap {
    width: 100%;
    box-sizing: border-box;
  }

  .action-row {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }

  @media (max-width: ${breakpoints.mdWide}) {
    .action-row {
      justify-content: stretch;
    }
  }
`;

const ActionButton = styled(Button)`
  min-width: 10rem;
  width: auto;
  flex-shrink: 1;
  max-width: 100%;

  @media (max-width: ${breakpoints.mdWide}) {
    width: 100%;
    min-width: unset;
    align-self: stretch;
  }

  padding: 0 !important;
  box-sizing: border-box;
`;

const PriceWrap = styled.div`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
`;

const MetaBarV2 = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin: 6px 0 8px 0;

  @media (max-width: ${breakpoints.mdWide}) {
    align-items: stretch;
  }
`;

const MetaLeft = styled.div`
  color: #334155;
  strong {
    color: #0f172a;
  }
`;

const MetaActionsRowV2 = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-1);

  @media (max-width: 720px) {
    width: 100%;
    justify-content: space-between;
    gap: 8px;
  }
`;

const HighlightsV2 = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.875rem;
  @media (max-width: 820px) {
    display: none;
  }
`;

/* reuse the existing highlight item/badge styles */
const HighlightItem = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: ${RADIUS}px;
  padding: var(--space-2) 1.125rem;
  display: flex;
  gap: 12px;
  align-items: flex-start;

  h4 {
    margin: 0 0 4px 0;
    font-size: 15px;
    color: #1e1b2e;
    font-weight: 600;
  }
  p {
    margin: 0;
    font-size: 12.5px;
    color: #4b5563;
    line-height: 1.4;
  }
`;

const IconBadge = styled.span`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: ${RADIUS_SM}px;
  background: #e2e8f0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #334155;
  svg {
    color: #334155;
  }
`;

const SectionHeader = styled.div`
  margin: 1.5rem 0 0.75rem 0;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  h3 {
    margin: 0;
    font-size: 18px;
    color: #0f172a;
  }
  span {
    color: #334155;
    font-weight: 600;
  }
`;

const GridContainerV2 = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(1, minmax(220px, 1fr));
  grid-auto-rows: 1fr;
  column-gap: clamp(12px, 1.8vw, 20px);
  row-gap: 20px;

  @media (min-width: 520px) {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(220px, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, minmax(220px, 1fr));
  }
`;

const SortCol = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  label {
    color: #334155;
    font-size: 13px;
  }

  @media (max-width: ${breakpoints.mdWide}) {
    display: none;
  }
`;

const SelectEl = styled.select`
  height: 38px;
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: ${RADIUS_SM}px;
  padding: 0 12px;
  color: #111827;
  font-size: 14px;
  font-weight: 500;
`;

const ClearButton = styled(ActionButton)`
  @media (max-width: 900px) {
    display: none;
  }
`;

export default HomeV2;
