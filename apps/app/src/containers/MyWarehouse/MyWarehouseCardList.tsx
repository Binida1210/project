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

export function MyWarehouseCardList({ type, warehouses, fallback, loading }: MyWarehouseCardListProps) {
  const renderList = () => {
    if (warehouses && warehouses.length > 0) {
      return (
        <MyWarehouseCardListRoot>
          <p>{warehouses.length} kho bãi</p>
          <GridContainer>
            {warehouses.map((it) => (
              <MyWarehouseViewCard
                key={type === MyWarehouseViewCardType.Owning ? it.id : it.rentedInfo?.id}
                type={type}
                warehouse={it}
              ></MyWarehouseViewCard>
            ))}
          </GridContainer>
        </MyWarehouseCardListRoot>
      );
    } else return fallback;
  };

  return <>{loading ? <Loading /> : renderList()}</>;
}

const MyWarehouseCardListRoot = styled.div`
  /* make the list container fluid while keeping the previous max width for larger screens */
  width: 100%;
  max-width: 1236px;
  margin: 0 auto;
`;

const GridContainer = styled.div`
  width: 100%;
  margin-top: 12px;
  display: grid;
  /* explicit columns at breakpoints for stable responsive behavior
      < 640px: 1 column
      >=640px: 2 columns
      >=768px: 3 columns
      >=1024px: 4 columns */
  grid-template-columns: repeat(2, minmax(220px, 1fr));
  /* make each row take equal height so cards align across each row */
  grid-auto-rows: 1fr;
  gap: 12px;

  /* small and narrow screens will use 2 columns by default (requested) */

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(220px, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, minmax(220px, 1fr));
  }
`;
