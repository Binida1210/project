/* eslint-disable simple-import-sort/imports, import/order */
import { ReactNode } from 'react';
import './MyWarehouseCardListMasonry.css';

import { Loading } from '@/components/Fallback';
import { MyWarehouseViewCard, MyWarehouseViewCardType } from '@/components/MyWarehouseViewCard';
import { WareHouseModel } from '@/models/warehouse.model';

export type MyWarehouseCardListProps = {
  type: MyWarehouseViewCardType;
  warehouses: WareHouseModel[];
  loading?: boolean;
  fallback?: ReactNode;
};

export function MyWarehouseCardListMasonry({ type, warehouses, fallback, loading }: MyWarehouseCardListProps) {
  const renderList = () => {
    if (warehouses && warehouses.length > 0) {
      return (
        <div className="my-warehouse-masonry-root">
          <div className="my-warehouse-masonry-header">
            <p className="my-warehouse-masonry-count">{warehouses.length} kho bãi</p>
          </div>

          <div className="my-warehouse-masonry-grid">
            {warehouses.map((it) => (
              <div
                key={type === MyWarehouseViewCardType.Owning ? it.id : it.rentedInfo?.id}
                className="my-warehouse-masonry-item"
              >
                <MyWarehouseViewCard type={type} warehouse={it} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return fallback;
  };

  return <>{loading ? <Loading /> : renderList()}</>;
}
