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
  /* use a responsive auto-fit grid so columns shrink and reflow smoothly */
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  /* make each row take equal height so cards align across each row */
  grid-auto-rows: 1fr;
  gap: 12px;

  /* ensure the grid keeps reasonable spacing on very small screens */
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;
