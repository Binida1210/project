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

// MyWarehouse page shows the user's warehouses or renting history.
// It fetches the current user's warehouses on mount and resets state on unmount.
export const MyWarehouse = () => {
  const { user } = useAuthStore();
  const { fetchMyWarehouses, reset, ownWarehousesLoading, rentedWarehouses, ownWarehouse, rentedWarehousesLoading } =
    useMyWarehouseStore();

  useEffect(() => {
    // load the user's warehouses once when the page mounts
    fetchMyWarehouses(user);

    // cleanup: reset local store slice when leaving the page
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

  // Render different list views depending on current user's role
  // - Renters see a simple renting history list
  // - Owners see a tabbed view: their accepted warehouses, renting history, and request status
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
      <ContentWrap>
        {user?.role === Role.Owner && (
          <CreateWareHouse>
          <Link to="/create">
            <button
              style={{
                marginTop: '2rem',
                padding: '1rem 1.5rem',
                backgroundColor: 'rgb(124, 102, 220)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgb(110, 86, 207)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgb(124, 102, 220)')}
            >
              Tạo kho bãi
            </button>
          </Link>
        </CreateWareHouse>
      )}
        {renderMyList()}
      </ContentWrap>
    </MyWarehouseRoot>
  );
};

const MyWarehouseRoot = styled.div`
  --tabs-width: 1280px;
  max-width: 100%;
`;

const MyWarehouseTabs = styled(Tabs)`
  width: min(var(--tabs-width), 96%);
  margin: 0 auto;
`;

const CreateWareHouse = styled.div`
  width: min(var(--tabs-width), 96%);
  margin: 2rem auto 1.5rem;
  display: flex;
  justify-content: flex-end;
`;

const NothingContainer = styled.div`
  color: gray;
  text-align: center;
`;

const ContentWrap = styled.div`
  width: min(var(--tabs-width), 96%);
  margin: 0 auto;
  padding: 2rem; /* padding 2rem on all sides */
`;
