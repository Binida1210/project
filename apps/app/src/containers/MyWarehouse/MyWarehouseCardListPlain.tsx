/* eslint-disable simple-import-sort/imports, import/order */
import { ReactNode } from 'react';

import { Loading } from '@/components/Fallback';
import { MyWarehouseViewCard, MyWarehouseViewCardType } from '@/components/MyWarehouseViewCard';
import { WareHouseModel } from '@/models/warehouse.model';
import './MyWarehouseCardListPlain.css';

export type MyWarehouseCardListProps = {
  type: MyWarehouseViewCardType;
  warehouses: WareHouseModel[];
  loading?: boolean;
  fallback?: ReactNode;
};

export function MyWarehouseCardListPlain({ type, warehouses, fallback, loading }: MyWarehouseCardListProps) {
  const renderList = () => {
    if (warehouses && warehouses.length > 0) {
      return (
        <div className="my-warehouse-list-root">
          <div className="my-warehouse-header">
            <p className="my-warehouse-count">{warehouses.length} kho bãi</p>
          </div>

          <div className="my-warehouse-grid">
            {warehouses.map((it) => (
              <div
                key={type === MyWarehouseViewCardType.Owning ? it.id : it.rentedInfo?.id}
                className="my-warehouse-card-wrapper"
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
