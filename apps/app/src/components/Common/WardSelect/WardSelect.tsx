import { blackA, mauve, violet } from '@radix-ui/colors';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import * as Select from '@radix-ui/react-select';
import { styled } from '@stitches/react';
import React, { ReactNode } from 'react';

import { WARD_OPTIONS } from '@/constants/ward-options.constant';
import { WardValue } from '@/enums/ward-value.enum';

type WardSelectProps = {
  triggerStyles?: React.CSSProperties;
  name?: string;
  onSelect?: (value: string) => void;
  allSelect?: boolean;
  defaultValue?: string;
  value?: string;
};

export const WardSelect = (props: WardSelectProps) => {
  const { onSelect } = props;

  return (
    <Select.Root
      defaultValue={props.defaultValue}
      name={props.name}
      value={props.value}
      onValueChange={(value) => onSelect?.(value)}
    >
      <SelectTrigger aria-label="Food" style={props.triggerStyles}>
        <Select.Value placeholder="Chọn quận" />
        <SelectIcon>
          <ChevronDownIcon />
        </SelectIcon>
      </SelectTrigger>
      <Select.Portal>
        <SelectContent>
          <SelectScrollUpButton>
            <ChevronUpIcon />
          </SelectScrollUpButton>
          <SelectViewport>
            <Select.Group>
              {WARD_OPTIONS.filter((ward) => (props.allSelect ? ward.value !== WardValue.ALL.toString() : true)).map(
                (it) => (
                  <SelectItem key={it.value} value={it.value}>
                    {it.label}
                  </SelectItem>
                ),
              )}
            </Select.Group>
          </SelectViewport>
          <SelectScrollDownButton>
            <ChevronDownIcon />
          </SelectScrollDownButton>
        </SelectContent>
      </Select.Portal>
    </Select.Root>
  );
};

const SelectTrigger = styled(Select.SelectTrigger, {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 12,
  padding: '0 12px',
  fontSize: 13,
  lineHeight: 1,
  height: 38,
  gap: 5,
  backgroundColor: 'white',
  color: violet.violet11,
  border: '1px solid #e5e7eb',
  boxShadow: 'none',
  '&:hover': { backgroundColor: mauve.mauve2 },
  '&:focus': { boxShadow: `0 0 0 2px ${blackA.blackA7}` },
  '&[data-placeholder]': { color: violet.violet9 },
});

const SelectIcon = styled(Select.SelectIcon, {
  color: violet.violet11,
});

const SelectContent = styled(Select.Content, {
  zIndex: 200,
  overflow: 'hidden',
  backgroundColor: 'white',
  borderRadius: 12,
  border: '1px solid #e5e7eb',
  minWidth: 340,
  maxHeight: 420,
  boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)',
});

const SelectViewport = styled(Select.Viewport, {
  padding: 6,
});

type SelectItemProps = {
  children: ReactNode;
  value: string;
};

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(({ children, ...props }, forwardedRef) => {
  return (
    <StyledItem {...props} ref={forwardedRef}>
      <Select.ItemText>{children}</Select.ItemText>
      <StyledItemIndicator>
        <CheckIcon />
      </StyledItemIndicator>
    </StyledItem>
  );
});

const StyledItem = styled(Select.Item, {
  fontSize: 16,
  lineHeight: 1,
  color: violet.violet11,
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  height: 44,
  padding: '0 36px 0 28px',
  position: 'relative',
  userSelect: 'none',

  '&[data-disabled]': {
    color: mauve.mauve8,
    pointerEvents: 'none',
  },

  '&[data-highlighted]': {
    outline: 'none',
    backgroundColor: violet.violet9,
    color: violet.violet1,
  },
  '&[data-state="checked"]': {
    fontWeight: 600,
  },
});


const StyledItemIndicator = styled(Select.ItemIndicator, {
  position: 'absolute',
  left: 0,
  width: 25,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const scrollButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 25,
  backgroundColor: 'white',
  color: violet.violet11,
  cursor: 'default',
};

const SelectScrollUpButton = styled(Select.ScrollUpButton, scrollButtonStyles);

const SelectScrollDownButton = styled(Select.ScrollDownButton, scrollButtonStyles);

