import * as RadixPopover from '@radix-ui/react-popover';
import { ReactNode } from 'react';
import styled from 'styled-components';

type PopoverProps = {
  children: ReactNode;
  content: ReactNode;
  open?: boolean;
  handleInteractOutside?: () => void;
  handleClickTrigger?: () => void;
  handleOpenChange?: (isOpen: boolean) => void;
} & RadixPopover.PopoverContentProps;

const NoOutlineContent = styled(RadixPopover.Content)``;

const Root = styled(RadixPopover.Root)``;

export function Popover({
  open,
  children,
  content,
  handleOpenChange,
  handleClickTrigger,
  handleInteractOutside,
  ...props
}: PopoverProps) {
  return (
    <Root open={open} onOpenChange={handleOpenChange}>
      <RadixPopover.Trigger asChild onClick={handleClickTrigger}>
        {children}
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <NoOutlineContent {...props} onInteractOutside={handleInteractOutside}>
          {content}
          {}
        </NoOutlineContent>
      </RadixPopover.Portal>
    </Root>
  );
}

