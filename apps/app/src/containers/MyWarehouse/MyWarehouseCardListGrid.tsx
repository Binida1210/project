import { ReactNode } from 'react';
import styled from 'styled-components';

import { Loading } from '@/components/Fallback';
import { MyWarehouseViewCard, MyWarehouseViewCardType } from '@/components/MyWarehouseViewCard';
import { WareHouseModel } from '@/models/warehouse.model';

export type MyWarehouseCardListProps = {
  type: MyWarehouseViewCardType;
  warehouses: WareHouseModel[];
  loading?: boolean;
  fallback?: ReactNode;
};

// Stable grid layout: explicit responsive columns and consistent row sizing
export function MyWarehouseCardListGrid({ type, warehouses, fallback, loading }: MyWarehouseCardListProps) {
  const renderList = () => {
    if (warehouses && warehouses.length > 0) {
      return (
        <GridRoot>
          <HeaderRow>
            <p>{warehouses.length} kho bãi</p>
          </HeaderRow>

          <Grid>
            {warehouses.map((it) => (
              <CardCell key={type === MyWarehouseViewCardType.Owning ? it.id : it.rentedInfo?.id}>
                <MyWarehouseViewCard type={type} warehouse={it} />
              </CardCell>
            ))}
          </Grid>
        </GridRoot>
      );
    }

    return fallback;
  };

  return <>{loading ? <Loading /> : renderList()}</>;
}

const GridRoot = styled.div`
  width: 100%;
  max-width: 1260px;
  margin: 0 auto;
  padding: 12px 18px 28px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  p { margin: 0; font-weight: 600; color: #0f172a; }
`;

const Grid = styled.div`
  display: grid;
  gap: 18px;
  grid-auto-rows: 1fr; /* equal height per row */

  /* default: two columns to avoid single-column cramped look */
  grid-template-columns: repeat(2, minmax(220px, 1fr));

  /* very small phones -> 1 column */
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  /* tablet -> 3 columns */
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(220px, 1fr));
    gap: 20px;
  }

  /* desktop -> 4 columns */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, minmax(220px, 1fr));
    gap: 22px;
  }
`;

const CardCell = styled.div`
  display: flex;
  align-items: stretch;
`;

export default MyWarehouseCardListGrid;
