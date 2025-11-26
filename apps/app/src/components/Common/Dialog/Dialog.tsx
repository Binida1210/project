/* eslint-disable */
import * as RadixDialog from '@radix-ui/react-dialog';
import { DialogProps as RadixDialogProps } from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import {
  createContext,
  forwardRef,
  ReactNode,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled, { keyframes } from 'styled-components';

import { Loading } from '@/components/Fallback';

type PointerDownOutsideEvent = CustomEvent<{
  originalEvent: PointerEvent;
}>;
type FocusOutsideEvent = CustomEvent<{
  originalEvent: FocusEvent;
}>;

export type DialogProps = RadixDialogProps & {
  container?: HTMLElement;
  className?: string;
  loading?: boolean;
  onLoadingChange?: (loading: boolean) => void;
  fallback?: ReactNode;
  showFallback?: boolean;
  onDialogClose?: (data: any) => void;
  onOpenAutoFocus?: (e: Event) => void;
  onCloseAutoFocus?: (e: Event) => void;
  onEscapeKeyDown?: (e: KeyboardEvent) => void;
  onPointerDownOutside?: (e: PointerDownOutsideEvent) => void;
  onInteractOutside?: (e: PointerDownOutsideEvent | FocusOutsideEvent) => void;
};

export type DialogRef = {
  open?: (content?: ReactNode) => void;
};

export type DialogContext = {
  close: (data?: any) => void;
  setLoading: (loading: boolean) => void;
  setFallback: (fallback: ReactNode) => void;
  setShowFallback: (showFallback: boolean) => void;
  children?: ReactNode;
};

const DialogContext = createContext<DialogContext | undefined>(undefined);

export const DialogProvider = (props: DialogContext) => {
  const { children, ...context } = props;

  const value = useMemo(() => context, Object.values(context)) as DialogContext;

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
};

export const useDialogContext = () => {
  const context = useContext(DialogContext);

  if (!context) throw Error('Your component not inside Dialog context');

  return context;
};

export const Dialog = forwardRef<DialogRef, DialogProps>(
  (
    {
      defaultOpen,
      open,
      container,
      children,
      className,
      loading,
      onLoadingChange,
      showFallback = false,
      fallback,
      onDialogClose,
      onOpenAutoFocus,
      onCloseAutoFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      onInteractOutside,
      onOpenChange,
      ...props
    }: DialogProps,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ref,
  ) => {
    const [dialogOpen, setDialogOpen] = useControllableState({
      prop: open,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    });
    const [dialogLoading, setDialogLoading] = useControllableState({
      prop: loading,
      defaultProp: false,
      onChange: onLoadingChange,
    });
    const [dialogFallback, setDialogFallback] = useControllableState({
      defaultProp: fallback,
    });
    const [dialogShowFallback, setDialogShowFallback] = useControllableState({
      defaultProp: showFallback,
    });

    const closeReturn = useRef<any>(undefined);
    const onDialogCloseRef = useCallbackRef(onDialogClose);
    const [content, setContent] = useState<ReactNode>();

    useImperativeHandle(ref, () => ({
      open(content) {
        setDialogOpen(true);

        if (content) setContent(content);
      },
    }));

    useEffect(() => {
      if (!dialogOpen) {
        if (content) setContent(undefined);
        onDialogCloseRef?.(closeReturn);
      }
    }, [dialogOpen]);

    const close = (data: any) => {
      closeReturn.current = data;
      setDialogOpen(false);
    };

    return (
      <DialogRoot
        open={dialogOpen}
        {...props}
        onOpenChange={(open) => {
          setDialogOpen(open);
        }}
      >
        <DialogProvider
          close={close}
          setFallback={setDialogFallback}
          setLoading={setDialogLoading}
          setShowFallback={setDialogShowFallback}
        >
          <RadixDialog.Portal container={container}>
            <DialogOverlay />
            <DialogContent
              className={className}
              onCloseAutoFocus={onCloseAutoFocus}
              onEscapeKeyDown={onEscapeKeyDown}
              onInteractOutside={onInteractOutside}
              onOpenAutoFocus={onOpenAutoFocus}
              onPointerDownOutside={onPointerDownOutside}
            >
              <DialogContentBody>
                {dialogLoading ? (
                  <Loading size={30} />
                ) : (
                  <>{dialogShowFallback ? dialogFallback : content ?? children}</>
                )}
              </DialogContentBody>
              <RadixDialog.Close asChild>
                <CloseButton>
                  <Cross1Icon></Cross1Icon>
                </CloseButton>
              </RadixDialog.Close>
            </DialogContent>
          </RadixDialog.Portal>
        </DialogProvider>
      </DialogRoot>
    );
  },
);

export const overlayShow = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const contentShow = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

export const DialogRoot = styled(RadixDialog.Root)`
  background: red;
`;

export const DialogOverlay = styled(RadixDialog.Overlay)`
  background-color: rgba(0, 0, 0, 0.8);
  position: fixed;
  inset: 0;
  animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 9999;
`;

export const DialogContent = styled(RadixDialog.Content)`
  background-color: white;
  border-radius: 20px;
  box-shadow:
    hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  min-width: 150px;
  max-width: 90vw;
  max-height: 85vh;
  padding: 25px;
  animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);

  &:focus {
    outline: none;
  }
`;

export const DialogContentBody = styled.div``;

export const DialogTitle = styled(RadixDialog.Title)`
  margin: 0;
  font-weight: 500;
  margin: 10px 0 15px 0;
  color: var(--mauve12);
`;

export const DialogDescription = styled(RadixDialog.Description)`
  margin: 10px 0 20px;
  color: var(--mauve11);
  font-size: 15px;
  line-height: 1.5;
`;

export const CloseButton = styled.button`
  width: 38px;
  height: 38px;
  background-color: transparent;
  border-radius: 12px;
  border: none;
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 160ms ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
  &:focus-visible {
    outline: 2px solid #7c4dff;
    outline-offset: 2px;
  }
`;

