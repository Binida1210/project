import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { AuthUser } from '@/auth/models/auth';
import { Role } from '@/enums/role.enum';
import { WareHouseModel } from '@/models/warehouse.model';
import rentedWarehouseService from '@/service/rented-warehouse-service';
import warehouseService from '@/service/warehouse-service';
import { OmitFunctions } from '@/utils/type';

type MyWarehouseStore = {
  rentedWarehouses: WareHouseModel[];
  rentedWarehousesLoading: boolean;
  ownWarehouse: WareHouseModel[];
  ownWarehousesLoading: boolean;
  fetchMyWarehouses: (user: AuthUser | undefined) => Promise<void>;
  reset: () => void;
};

const initialState: OmitFunctions<MyWarehouseStore> = {
  rentedWarehouses: [],
  ownWarehousesLoading: false,
  ownWarehouse: [],
  rentedWarehousesLoading: false,
};

export const useMyWarehouseStore = create<MyWarehouseStore, [['zustand/immer', MyWarehouseStore]]>(
  immer<MyWarehouseStore>((set) => ({
    ...initialState,

    fetchMyWarehouses: async (user) => {
      set({ ownWarehousesLoading: true, rentedWarehousesLoading: true });
      if (user) {
        switch (user.role) {
          case Role.Owner:
            warehouseService
              .getOwnerWarehouse(user.id)
              .then((data) => {
                if (data && data.length !== 0) set({ ownWarehouse: data });
              })
              .finally(() => set({ ownWarehousesLoading: false }));

            rentedWarehouseService
              .getOwnerWarehouses(user.id)
              .then((data) => {
                if (data && data.length !== 0) set({ rentedWarehouses: data });
              })
              .finally(() => set({ rentedWarehousesLoading: false }));
            break;
          case Role.Renter:
            rentedWarehouseService
              .getRenterWarehouses(user.id)
              .then((data) => {
                if (data && data.length !== 0) set({ rentedWarehouses: data });
              })
              .finally(() => set({ rentedWarehousesLoading: false }));
            break;
          default:
            break;
        }
      } else set({ ownWarehousesLoading: false, rentedWarehousesLoading: false });
    },
    reset: () => set(initialState),
  })),
);

