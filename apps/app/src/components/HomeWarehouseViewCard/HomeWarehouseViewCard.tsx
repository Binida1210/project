import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { WareHouseModel } from '../../models/warehouse.model';
import { WarehouseViewCardBase, WarehouseViewCardProps } from '../WarehouseViewCardBase';
import { CardActions } from '../WarehouseViewCardBase/CardOptions';

type HomeWarehouseViewCardProps = {
  warehouse: WareHouseModel;
  onClick?: (id: number) => void;
};

// Small card used on the home page — shows price and a simple action
export const HomeWarehouseViewCard = ({ warehouse, onClick }: HomeWarehouseViewCardProps) => {
  const navigate = useNavigate();

  // Actions available on home listing cards
  const getHomeActions = useCallback((): CardActions[] => {
    const viewDetailAction: CardActions = {
      title: 'Xem kho bãi',
      onClick: () => navigate(`/warehouse/${warehouse.id}`),
    };

    return [viewDetailAction];
  }, [warehouse]);

  // Prepare props for the underlying WarehouseViewCardBase
  const getViewCardOptions = (): WarehouseViewCardProps => {
    return {
      showPrice: true,
      actions: getHomeActions(),
      warehouse,
      onClick,
    };
  };

  return (
    <WarehouseViewCardBase
      {...getViewCardOptions()}
      onDoubleClick={() => navigate(`/warehouse/${warehouse.id}`)}
    ></WarehouseViewCardBase>
  );
};
