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

// Using plain-CSS list temporarily so responsive style is easier to tweak
// experiment: different layout - masonry variant (plain CSS) for visual comparison
import { MyWarehouseCardListGrid as MyWarehouseCardList } from './MyWarehouseCardListGrid';

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

export const MyWarehouse = () => {
  const { user } = useAuthStore();
  const { fetchMyWarehouses, reset, ownWarehousesLoading, rentedWarehouses, ownWarehouse, rentedWarehousesLoading } =
    useMyWarehouseStore();

  useEffect(() => {
    fetchMyWarehouses(user);

    return () => {
      reset();
    };
  }, []);

  const sortByRentingStatus = (a: WareHouseModel, b: WareHouseModel) => {
    if (!a.rentedInfo && !b.rentedInfo) {
      return 0;
    } else if (!a.rentedInfo) {
      return 1;
    } else if (!b.rentedInfo) {
      return -1;
    } else {
      return rentingStatusWeight[a.rentedInfo.status] - rentingStatusWeight[b.rentedInfo.status];
    }
  };

  const renderNoContent = () => {
    return (
      <NothingContainer>
        <h2>Chưa có gì ở đây</h2>
      </NothingContainer>
    );
  };

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
    else if (user?.role === Role.Owner)
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
        ></MyWarehouseTabs>
      );
  };

  return (
    <MyWarehouseRoot>
      {user?.role === Role.Owner && (
        <CreateWareHouse>
          <Link to="/create">
            <Button>Tạo kho bãi</Button>
          </Link>
        </CreateWareHouse>
      )}
      {renderMyList()}
    </MyWarehouseRoot>
  );
};

const MyWarehouseRoot = styled.div`
  /* keep the tabs area bounded and responsive so it never forces horizontal scroll */
  --tabs-width: 1280px;
  max-width: 100%;
`;

const MyWarehouseTabs = styled(Tabs)`
  /* use a responsive width: cap to the fixed design width but allow shrinking */
  width: min(var(--tabs-width), 96%);
  margin: 0 auto;
`;

const CreateWareHouse = styled.div`
  /* place button inside the same bounded content width as tabs and align to the right
     so it doesn't visually overlap the tabs area or cause horizontal scroll */
  width: min(var(--tabs-width), 96%);
  margin: 0 auto 12px; /* keep gap between button and tabs */
  display: flex;
  justify-content: flex-end;
`;

const NothingContainer = styled.div`
  color: gray;
  text-align: center;
`;
