import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useAuthStore } from '@/auth';
import { Button } from '@/components/Common/Button';
import { Tabs } from '@/components/Common/Tabs';
import { MyWarehouseViewCardType } from '@/components/MyWarehouseViewCard';
import { Role } from '@/enums/role.enum';
import { RentedWarehouseStatus } from '@/models/rented-warehouse.model';
import { WareHouseModel, WarehouseStatus } from '@/models/warehouse.model';
import { useMyWarehouseStore } from '@/store/my-warehouse.store';

import { MyWarehouseCardListV3 as MyWarehouseCardList } from './MyWarehouseCardListV3';

const rentingStatusWeight: Record<RentedWarehouseStatus, number> = {
  [RentedWarehouseStatus.Waiting]: 1,
  [RentedWarehouseStatus.Confirmed]: 2,
  [RentedWarehouseStatus.Renting]: 3,
  [RentedWarehouseStatus.Ended]: 4,
  [RentedWarehouseStatus.Canceling]: 5,
  [RentedWarehouseStatus.Expired]: 6,
  [RentedWarehouseStatus.Canceled]: 7,
  [RentedWarehouseStatus.None]: 8,
};

// MyWarehouseV3: responsive rewrite of MyWarehouse page
export const MyWarehouseV3 = () => {
  const { user } = useAuthStore();
  const { fetchMyWarehouses, reset, ownWarehousesLoading, rentedWarehouses, ownWarehouse, rentedWarehousesLoading } =
    useMyWarehouseStore();

  useEffect(() => {
    fetchMyWarehouses(user);
    return () => reset();
  }, [fetchMyWarehouses, reset, user]);

  const sortByRentingStatus = (a: WareHouseModel, b: WareHouseModel) => {
    if (!a.rentedInfo && !b.rentedInfo) return 0;
    if (!a.rentedInfo) return 1;
    if (!b.rentedInfo) return -1;
    return rentingStatusWeight[a.rentedInfo.status] - rentingStatusWeight[b.rentedInfo.status];
  };

  const renderNoContent = () => (
    <NothingContainer>
      <h2>Chưa có gì ở đây</h2>
    </NothingContainer>
  );

  const renderMyList = () => {
    if (user?.role === Role.Renter)
      return (
        <MyWarehouseCardList
          fallback={renderNoContent()}
          loading={rentedWarehousesLoading}
          type={MyWarehouseViewCardType.RenterRentingHistory}
          warehouses={rentedWarehouses.sort(sortByRentingStatus)}
        />
      );

    if (user?.role === Role.Owner)
      return (
        <MyWarehouseTabs
          tabs={[
            {
              tab: 'Kho bãi',
              content: (
                <MyWarehouseCardList
                  fallback={renderNoContent()}
                  loading={ownWarehousesLoading}
                  type={MyWarehouseViewCardType.Owning}
                  warehouses={ownWarehouse.filter((w) => w.status === WarehouseStatus.Accepted)}
                />
              ),
            },
            {
              tab: 'Lịch sử',
              content: (
                <MyWarehouseCardList
                  fallback={renderNoContent()}
                  loading={rentedWarehousesLoading}
                  type={MyWarehouseViewCardType.OwnerRentingHistory}
                  warehouses={rentedWarehouses.sort(sortByRentingStatus)}
                />
              ),
            },
            {
              tab: 'Trạng thái duyệt bài',
              content: (
                <MyWarehouseCardList
                  fallback={renderNoContent()}
                  loading={ownWarehousesLoading}
                  type={MyWarehouseViewCardType.RequestHistory}
                  warehouses={ownWarehouse}
                />
              ),
            },
          ]}
        />
      );

    return null;
  };

  return (
    <Root>
      <TopRow>
        <TitleWrap>
          <h2>Kho của tôi</h2>
          <Count>{(ownWarehouse?.length ?? 0) + (rentedWarehouses?.length ?? 0)}</Count>
        </TitleWrap>

        {user?.role === Role.Owner && (
          <CreateWrap>
            <Link to="/create">
              <Button color="primary">Tạo kho bãi</Button>
            </Link>
          </CreateWrap>
        )}
      </TopRow>

      <Content>
        <Panel>{renderMyList()}</Panel>
      </Content>
    </Root>
  );
};

const Root = styled.div`
  width: 100%;
  padding: 12px;

  @media (max-width: 480px) {
    padding: 0px;
  }
`;

const TopRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 8px;
  }
`;

const TitleWrap = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  h2 {
    margin: 0;
    font-size: 1.25rem;
    color: #0f172a;
  }
`;

const Count = styled.span`
  color: #6b7280;
  font-weight: 600;
`;

const CreateWrap = styled.div`
  margin-left: auto;
  @media (max-width: 480px) {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-left: 0;
  }
`;

const Content = styled.div`
  width: 100%;
`;

const Panel = styled.div`
  background: transparent;
`;

const MyWarehouseTabs = styled(Tabs)`
  width: min(var(--tabs-width, 1280px), 96%);
  margin: 0 auto 12px;
`;

const NothingContainer = styled.div`
  color: gray;
  text-align: center;
  padding: 2rem 0;
`;

export default MyWarehouseV3;
