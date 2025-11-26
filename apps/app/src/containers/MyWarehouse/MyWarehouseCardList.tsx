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
              <CardCell key={type === MyWarehouseViewCardType.Owning ? it.id : it.rentedInfo?.id}>
                <CardInner>
                  <MyWarehouseViewCard type={type} warehouse={it}></MyWarehouseViewCard>
                </CardInner>
              </CardCell>
            ))}
          </GridContainer>
        </MyWarehouseCardListRoot>
      );
    } else return fallback;
  };

  return <>{loading ? <Loading /> : renderList()}</>;
}

const MyWarehouseCardListRoot = styled.div`
  width: 100%;
  max-width: 1236px;
  margin: 0 auto;
`;

const GridContainer = styled.div`
  width: 100%;
  margin-top: 12px;
  display: grid;
  justify-items: center;

  grid-template-columns: repeat(2, minmax(220px, 1fr));

  grid-auto-rows: 1fr;
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(220px, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, minmax(220px, 1fr));
  }
`;

const CardCell = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  justify-content: center;
`;

const CardInner = styled.div`
  display: flex;
  width: 100%;
  align-items: stretch;
  justify-content: center;
  max-width: 100%;

  @media (max-width: 479px) {
    max-width: 80dvw;
    max-width: 80vw;
  }
`;
