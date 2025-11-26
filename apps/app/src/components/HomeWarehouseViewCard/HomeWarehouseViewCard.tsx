import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { WareHouseModel } from '../../models/warehouse.model';
import { WarehouseViewCardBase, WarehouseViewCardProps } from '../WarehouseViewCardBase';
import { CardActions } from '../WarehouseViewCardBase/CardOptions';

type HomeWarehouseViewCardProps = {
  warehouse: WareHouseModel;
  onClick?: (id: number) => void;
};

export const HomeWarehouseViewCard = ({ warehouse, onClick }: HomeWarehouseViewCardProps) => {
  const navigate = useNavigate();

  const getHomeActions = useCallback((): CardActions[] => {
    const viewDetailAction: CardActions = {
      title: 'Xem kho bãi',
      onClick: () => navigate(`/warehouse/${warehouse.id}`),
    };

    return [viewDetailAction];
  }, [warehouse]);

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

