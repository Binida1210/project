import { Close as RadixDialogClose } from '@radix-ui/react-dialog';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import styled from 'styled-components';

import { Button } from '../Button';
import { DialogContext, useDialogContext } from './Dialog';

export type ConfirmDialogActionHelpers = Omit<DialogContext, 'children'>;

export type ConfirmDialogActionProps = {
  disabled?: boolean;
  acceptText?: string;
  acceptDisable?: boolean;
  cancelText?: string;
  onAccept?: (helpers: ConfirmDialogActionHelpers) => void;
  onCancel?: () => void;
};

export function ConfirmDialogAction({
  acceptText = 'Đồng ý',
  cancelText = 'Hủy',
  acceptDisable,
  onAccept,
  onCancel,
  ...props
}: ConfirmDialogActionProps) {
  const dialog = useDialogContext();
  const [disabled] = useControllableState({
    prop: props.disabled,
    defaultProp: false,
  });

  return (
    <ButtonGroup>
      <RadixDialogClose asChild>
        <Button color={'danger'} disabled={disabled} onClick={onCancel}>
          {cancelText}
        </Button>
      </RadixDialogClose>
      <Button disabled={disabled || acceptDisable} onClick={() => onAccept?.(dialog)}>
        {acceptText}
      </Button>
    </ButtonGroup>
  );
}

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 18px;
  align-items: center;

  .irent-payment-dialog & {
    justify-content: center;
    gap: 12px;
    margin-top: 22px;
    padding: 0 12px;
  }

  .irent-payment-dialog & > button:last-child {
    width: 100%;
    max-width: 360px;
    padding: 12px 22px;
    border-radius: 14px;
    background: linear-gradient(90deg, #8b5cf6 0%, #7c4dff 100%);
    color: #fff;

    font-weight: 700;
    font-size: 15px;
    height: auto;
  }

  @media (max-width: 480px) {
    .irent-payment-dialog & {
      flex-direction: column-reverse;
      align-items: stretch;
    }

    .irent-payment-dialog & > button {
      width: 100%;
      max-width: 100%;
      height: 48px;
      border-radius: 12px;
    }
  }
`;
