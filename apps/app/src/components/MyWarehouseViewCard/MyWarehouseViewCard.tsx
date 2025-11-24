import { red } from '@radix-ui/colors';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

import { useAuthStore } from '@/auth';
import { api } from '@/axios/axios';
import { useContract } from '@/hooks';
import { RentedWarehouseStatus } from '@/models/rented-warehouse.model';
import { WareHouseModel } from '@/models/warehouse.model';
import rentedWarehouseService from '@/service/rented-warehouse-service';
import { useMyWarehouseStore } from '@/store/my-warehouse.store';
import { formatPrice } from '@/utils/format-price.util';

import { ConfirmDialog, ConfirmDialogProps, Dialog, DialogProps } from '../Common/Dialog';
import { CustomerPaymentDialog, CustomerPaymentDialogProps } from '../Payment';
import { WarehouseViewCardBase, WarehouseViewCardProps } from '../WarehouseViewCardBase';
import { MenuCardActions } from '../WarehouseViewCardBase/MenuCardOptions';
import { ExtendActionDialogContent } from './ExtendActionDialogContent';

export enum MyWarehouseViewCardType {
  OwnerRentingHistory, // Owner
  Owning, // Owner
  RequestHistory, // Owner
  RenterRentingHistory, // Renter
}

type MyWarehouseViewCardProps = {
  warehouse: WareHouseModel;
  type?: MyWarehouseViewCardType;
  onClick?: (id: number) => void;
};

type ActionDialog =
  | {
      type: 'confirm';
      options?: ConfirmDialogProps;
    }
  | {
      type: 'payment';
      options?: CustomerPaymentDialogProps;
    }
  | {
      type: 'dialog';
      options: DialogProps;
    };

// Component: provides card actions and dialogs for warehouse items
export const MyWarehouseViewCard = ({
  type = MyWarehouseViewCardType.RenterRentingHistory,
  ...props
}: MyWarehouseViewCardProps) => {
  const warehouse = props.warehouse;
  const fetchMyWarehouses = useMyWarehouseStore((state) => state.fetchMyWarehouses);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { createContract, viewContract } = useContract();

  const [dialogOpen, setDialogOpen] = useState(true);
  const [actionDialog, setActionDialog] = useState<ActionDialog>();

  // Return the right set of props and actions for the requested card type
  const getViewCardOptions = (): WarehouseViewCardProps => {
    switch (type) {
      case MyWarehouseViewCardType.RenterRentingHistory:
        return {
          ...props,
          showRentedProgression: true,
          showRentingStatus: true,
          showRentedInfo: true,
          actions: getRentingTypeActions(),
        };
      case MyWarehouseViewCardType.Owning:
        return {
          ...props,
          showPrice: true,
          showRentingStatus: true,
          actions: getOwningTypeActions(),
        };
      case MyWarehouseViewCardType.OwnerRentingHistory:
        return {
          ...props,
          showRentingStatus: true,
          showRentedInfo: true,
          actions: getHistoryTypeActions(),
        };
      case MyWarehouseViewCardType.RequestHistory:
        return {
          ...props,
          showWarehouseStatus: true,
          actions: getHistoryTypeActions(),
        };
      default:
        return { ...props, showRentedInfo: true, actions: getHistoryTypeActions() };
    }
  };

  const viewDetailAction = {
    title: 'Xem kho bãi',
    onClick: () => navigate(`/warehouse/${warehouse.id}`),
  };

  const viewDetailContractAction = {
    title: 'Xem hợp đồng',
    onClick: () => navigate(`/warehouse/${warehouse.id}/contract`),
  };

  const defaultActions = [viewDetailAction];

  // Actions shown for history/request type cards
  const getHistoryTypeActions = useCallback((): MenuCardActions[] => {
    switch (warehouse.rentedInfo?.status) {
      default:
        return defaultActions;
    }
  }, [warehouse.rentedInfo?.status]);

  // Actions for owner when viewing owned warehouses
  const getOwningTypeActions = useCallback((): MenuCardActions[] => {
    const confirmCancelActions: MenuCardActions = {
      title: 'Chấp thuận yêu cầu hủy',
      onClick: () => {
        setActionDialog({
          type: 'confirm',
          options: {
            title: 'Yêu cầu hủy thuê',
            children: (
              <>
                <p>Xác nhận chấp thuận yêu cầu hủy thuê?</p>
                <p>Sau khi chấp nhận yêu cầu hủy, người thuê kho của bạn sẽ được nhận lại toàn bộ tiền cọc</p>
              </>
            ),
            onAccept: () => {
              if (warehouse.rentedInfo) {
                rentedWarehouseService.confirmCancelWarehouse(warehouse.rentedInfo.id).finally(() => {
                  fetchMyWarehouses(user);
                });
              }
            },
          },
        });
        setDialogOpen(true);
      },
      type: 'warning',
    };

    switch (warehouse.rentedInfo?.status) {
      case RentedWarehouseStatus.Canceling:
        return [...defaultActions, confirmCancelActions];
      default:
        return [viewDetailAction];
    }
  }, [warehouse.rentedInfo?.status]);

  // Actions for renter when viewing renting state
  const getRentingTypeActions = useCallback((): MenuCardActions[] => {
    const requestCancelActions: MenuCardActions = {
      title: 'Yêu cầu hủy',
      onClick: () => {
        setActionDialog({
          type: 'confirm',
          options: {
            title: 'Yêu cầu hủy thuê',
            children: (
              <>
                <p>Xác nhận gửi yêu cầu hủy thuê?</p>
                <p>
                  Sau khi gửi yêu cầu hủy, bạn sẽ nhận lại được <strong>1/2</strong> tiền cọc.
                </p>
              </>
            ),
            onAccept: () => {
              if (warehouse.rentedInfo) {
                rentedWarehouseService.cancelWarehouse(warehouse.rentedInfo.id).finally(() => {
                  fetchMyWarehouses(user);
                });
              }
            },
          },
        });
        setDialogOpen(true);
      },
      type: 'warning',
    };

    const confirmActions: MenuCardActions = {
      title: 'Thanh toán',
      onClick: handleConfirmAction,
    };

    const extendAction: MenuCardActions = {
      title: 'Gia hạn',
      onClick: handleExtendAction,
    };

    switch (warehouse.rentedInfo?.status) {
      case RentedWarehouseStatus.Waiting:
        return [...defaultActions, confirmActions, requestCancelActions];
      case RentedWarehouseStatus.Renting:
      case RentedWarehouseStatus.Confirmed:
        return [...defaultActions, extendAction];
      default:
        return [...defaultActions];
    }
  }, [warehouse.rentedInfo?.status]);

  // Start payment flow for confirmation fee
  const handleConfirmAction = () => {
    const { rentedInfo, userId: ownerId } = warehouse;
    if (rentedInfo) {
      const { confirm, renterId } = rentedInfo;

      const clientSecretPromise = api
        .post<{ clientSecret: string }>('/payment/fee', { amount: confirm, ownerId, userId: renterId })
        .then((response) => {
          return response.data.clientSecret;
        });

      setActionDialog({
        type: 'payment',
        options: {
          clientSecret: () => clientSecretPromise,
          children: (
            <>
              <p>
                Bạn đang thực hiện thanh toán xác nhận thuê kho bãi <strong>{warehouse.name}</strong>
              </p>
              <p>
                Số tiền mà sau đây bạn phải trả là <strong>{formatPrice(warehouse.rentedInfo?.confirm)} VND</strong>
              </p>
            </>
          ),
          onAcceptPay: ({ handlePayment }) => handlePayment(),
        },
      });
      setDialogOpen(true);
    }
  };

  // Open dialog to request an extension
  const handleExtendAction = () => {
    setActionDialog({
      type: 'dialog',
      options: {
        children: <ExtendActionDialogContent warehouse={warehouse} />,
        onDialogClose: () => {
          fetchMyWarehouses(user);
          setActionDialog(undefined);
        },
      },
    });
    setDialogOpen(true);
  };

  // Called after a successful payment to finalize confirmation
  const handleConfirmPaymentSuccess = () => {
    if (warehouse.rentedInfo)
      rentedWarehouseService.confirmWarehouse(warehouse.rentedInfo.id).then(() => fetchMyWarehouses(user));
  };

  // Render a dialog depending on the selected actionDialog type
  const renderDialog = () => {
    if (actionDialog) {
      switch (actionDialog.type) {
        case 'confirm': {
          const { options } = actionDialog;
          return <ConfirmDialog {...options} open={dialogOpen} onOpenChange={setDialogOpen}></ConfirmDialog>;
        }
        case 'payment': {
          const { options } = actionDialog;
          return (
            <CustomerPaymentDialog
              {...options}
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              onSucceed={handleConfirmPaymentSuccess}
            ></CustomerPaymentDialog>
          );
        }
        case 'dialog': {
          const { options } = actionDialog;
          return <Dialog {...options} open={dialogOpen} onOpenChange={setDialogOpen}></Dialog>;
        }
      }
    }
  };

  return (
    <>
      <WarehouseViewCardBase
        {...getViewCardOptions()}
        onDoubleClick={(id) => navigate(`/warehouse/${id}`)}
      ></WarehouseViewCardBase>
      {renderDialog()}
    </>
  );
};
