import 'react-range-slider-input/dist/style.css';
import './style.css';

import { violetDark } from '@radix-ui/colors';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useEffect, useState } from 'react';
import RangeSlider from 'react-range-slider-input';
import styled from 'styled-components';

import { formatPrice } from '@/utils/format-price.util';

import { Button } from '../Button';

type PriceRangeSliderProps = {
  min: number;
  max: number;
  onInput?: (options: [number, number]) => void;
};

export const PriceRangeSlider = (props: PriceRangeSliderProps) => {
  const { min, max, onInput } = props;
  const [value, setValue] = useState<[number, number]>([min, max]);
  const [appliedValue, setAppliedValue] = useState<[number, number]>([min, max]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // initialize or cleanup if needed later
  }, []);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <Label>
          <span className="prefix">Giá</span>
          <span className="value">{formatPrice(appliedValue[0])}</span>
          <span className="dash">—</span>
          <span className="value">{formatPrice(appliedValue[1])}</span>
          <span className="suffix">VND</span>
        </Label>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <Container>
            <Title>
              <ValueBlock>
                <div className="num">{formatPrice(value[0])}</div>
                <div className="unit">VND</div>
              </ValueBlock>
              <Separator>→</Separator>
              <ValueBlock>
                <div className="num">{formatPrice(value[1])}</div>
                <div className="unit">VND</div>
              </ValueBlock>
            </Title>
            <RangeSlider
              defaultValue={[value[0], value[1]]}
              max={max}
              min={min}
              onInput={(priceRange: [number, number]) => {
                setValue(priceRange);
              }}
            />
            <ButtonContainer>
              <Button
                onClick={() => {
                  onInput?.(value);
                  setAppliedValue(value);
                  setOpen(false);
                }}
              >
                Áp dụng
              </Button>
            </ButtonContainer>
          </Container>
          {/* Arrow color matches panel background for a clean look */}
          <DropdownMenu.Arrow style={{ fill: '#ffffff' }} />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const Container = styled.div`
  width: 340px;
  background: #ffffff;
  padding: 18px 16px 22px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  border: 1px solid #e5e7eb;
  border-radius: 12px; /* aligned with page radius */
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 16px;
  justify-content: center;
`;

const ValueBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .num {
    font-size: 18px;
    font-weight: 600;
    color: ${violetDark.violet11};
  }
  .unit {
    font-size: 11px;
    color: ${violetDark.violet9};
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
`;

const Separator = styled.div`
  font-size: 18px;
  color: ${violetDark.violet10};
  font-weight: 600;
`;

const Label = styled.label`
  display: inline-flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  width: 100%;
  border-radius: 12px; /* aligned */
  padding: 0 12px;
  height: 38px; /* align with Select trigger & button */
  gap: 8px;
  font-size: 13px;
  background: #ffffff;
  color: #0f172a;
  box-shadow: none;
  .prefix {
    font-weight: 600;
    color: #0f172a;
  }
  .value {
    font-weight: 600;
    color: #0f172a;
  }
  .dash {
    opacity: 0.6;
  }
  .suffix {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #475569;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 28px;
  text-align: right;
`;
