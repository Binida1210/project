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

/**
 * MyWarehouseCardListV3
 * - Better responsive grid breakpoints
 * - Cards fill full height of grid cell
 * - Content is horizontally centered and has consistent maxWidth
 */
export function MyWarehouseCardListV3({ type, warehouses, fallback, loading }: MyWarehouseCardListProps) {
  const renderList = () => {
    if (warehouses && warehouses.length > 0) {
      return (
        <GridRoot>
          <HeaderRow>
            <p style={{ paddingBottom: '1rem' }}>{warehouses.length} kho bãi</p>
          </HeaderRow>

          <Grid>
            {warehouses.map((it) => (
              <CardCell key={type === MyWarehouseViewCardType.Owning ? it.id : it.rentedInfo?.id}>
                <CardInner>
                  <MyWarehouseViewCard type={type} warehouse={it} />
                </CardInner>
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
  padding: 12px 0 28px;

  @media (max-width: 480px) {
    padding: 8px 0 16px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    margin: 0;
    font-weight: 600;
    color: #0f172a;
  }
`;

const Grid = styled.div`
  width: 100%;
  display: grid;
  gap: 16px;
  grid-auto-rows: 1fr;

  grid-template-columns: 1fr;
  justify-items: center;

  @media (max-width: 479px) {
    gap: 12px;
  }

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, minmax(200px, 1fr));
    justify-items: stretch;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(220px, 1fr));
    gap: 20px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, minmax(220px, 1fr));
    gap: 22px;
  }
`;

const CardCell = styled.div`
  display: flex;
  width: 100%;
  @media (max-width: 479px) {
    justify-content: center;
  }
`;

const CardInner = styled.div`
  display: flex;
  width: 100%;
  align-items: stretch;
  justify-content: center;
  max-width: 100%;

  @media (max-width: 479px) {
    width: 100%;
    max-width: 80vw;
    margin: 0 auto;
    padding: 0 6px;
  }
`;

export default MyWarehouseCardListV3;
