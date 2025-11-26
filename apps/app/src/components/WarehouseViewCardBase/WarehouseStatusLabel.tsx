import { blue, green, red } from '@radix-ui/colors';
import styled from 'styled-components';

import { RentedWarehouseLabel } from '@/models/rented-warehouse.model';
import { WarehouseLabel, WarehouseStatus } from '@/models/warehouse.model';

import { Label } from '../Common/Label';

export type WarehouseStatusLabelProps = {
  status: WarehouseStatus;
};

export function WarehouseStatusLabel({ status }: WarehouseStatusLabelProps) {
  const getColor = () => {
    switch (status) {
      case WarehouseStatus.Pending:
        return blue.blue9;
      case WarehouseStatus.Accepted:
        return green.green9;
      case WarehouseStatus.Rejected:
        return red.red9;
      default:
        return blue.blue9;
    }
  };

  return <Status color={getColor()}>{WarehouseLabel[status]}</Status>;
}

const Status = styled(Label)`
  position: absolute;
  
  top: -20px;
  right: 20px;
  @media (max-width: 720px) {
    
    top: -16px;
  }
`;

