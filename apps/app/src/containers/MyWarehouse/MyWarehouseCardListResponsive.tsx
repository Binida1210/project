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

export function MyWarehouseCardListResponsive({ type, warehouses, fallback, loading }: MyWarehouseCardListProps) {
  const renderList = () => {
    if (warehouses && warehouses.length > 0) {
      return (
        <Root>
          <HeaderRow>
            <CountLabel>{warehouses.length} kho bãi</CountLabel>
          </HeaderRow>

          <Grid>
            {warehouses.map((it) => (
              <CardKeyWrapper key={type === MyWarehouseViewCardType.Owning ? it.id : it.rentedInfo?.id}>
                <MyWarehouseViewCard type={type} warehouse={it} />
              </CardKeyWrapper>
            ))}
          </Grid>
        </Root>
      );
    }

    return fallback;
  };

  return <>{loading ? <Loading /> : renderList()}</>;
}


const Root = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px 18px 24px; 
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CountLabel = styled.p`
  margin: 0;
  font-weight: 600;
  color: #0f172a;
`;

const Grid = styled.div`
  margin-top: 16px;
  display: grid;
  gap: 18px;
  grid-auto-rows: 1fr;

  
  grid-template-columns: repeat(2, minmax(220px, 1fr));

  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(220px, 1fr));
    gap: 20px;
  }

  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, minmax(220px, 1fr));
    gap: 22px;
  }

  
  @media (min-width: 1400px) {
    grid-template-columns: repeat(5, minmax(220px, 1fr));
  }
`;


const CardKeyWrapper = styled.div`
  display: flex;
  align-items: stretch;
`;


