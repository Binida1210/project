import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { produce } from 'immer';
import { findLastIndex } from 'lodash';
import { ReactNode, useEffect, useMemo } from 'react';
import { useImmerReducer } from 'use-immer';

import { StepperProvider } from './context/StepperContext';
import { StepperAction, StepperItemType } from './models/stepper-item.model';

export type StepperProps = {
  items: StepperItemType[];
  children?: ReactNode;
  isCanNext?: boolean;
  defaultCanNextOnNewStep?: boolean;
  isDisable?: boolean;
  onCanNextChange?: (canNext: boolean) => void;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
};

const getStepperItemsState = (items: StepperItemType[]) => {
  const currentItem = items.find((i) => i.status === 'active');
  const currentIndex = currentItem !== undefined ? items.indexOf(currentItem) : -1;
  const isLastStep = currentIndex === items.length - 1;
  const isFirstStep = currentIndex === 0;

  return { currentItem, currentIndex, isLastStep, isFirstStep };
};

export const Stepper = ({
  items: propItems,
  children,
  onStepChange,
  onComplete,
  defaultCanNextOnNewStep = true,
  onCanNextChange,
  ...props
}: StepperProps) => {
  const [isCanNext, setCanNext] = useControllableState<boolean>({
    defaultProp: defaultCanNextOnNewStep,
    prop: props.isCanNext,
    onChange: onCanNextChange,
  });
  const [isDisable, setDisable] = useControllableState<boolean>({ defaultProp: false, prop: props.isDisable });

  const stepReducer = (state: StepperItemType[], action: StepperAction) => {
    function updateIndex(newIndex: number) {
      state.forEach((item, index) => {
        if (index < newIndex) item.status = 'finish';
        else if (index === newIndex) item.status = 'active';
        else item.status = 'default';
      });
    }

    const { currentIndex, isLastStep, isFirstStep } = getStepperItemsState(state);

    switch (action.type) {
      case 'jump':
        return;
      case 'next': {
        console.log('next');

        if (isLastStep) break;

        updateIndex(currentIndex + 1);

        break;
      }
      case 'back': {
        console.log('back');

        if (isFirstStep || currentIndex === undefined) break;

        updateIndex(currentIndex - 1);

        break;
      }
      case 'set':
        console.log('set', action.new);

        return action.new;
      default:
    }
  };

  const [items, dispatch] = useImmerReducer(stepReducer, propItems);

  const { currentIndex, currentItem, isLastStep, isFirstStep } = useMemo(() => getStepperItemsState(items), [items]);

  console.log(currentIndex, currentItem, isLastStep, isFirstStep);

  useEffect(() => {
    let farthestActiveIndex = findLastIndex(propItems, { status: 'active' });
    farthestActiveIndex = farthestActiveIndex === -1 ? 0 : farthestActiveIndex;

    propItems.forEach((item, index) => {
      if (index < farthestActiveIndex) item.status = 'finish';
      else if (index === farthestActiveIndex) item.status = 'active';
      else item.status = 'default';
    });

    dispatch({ type: 'set', new: propItems });
  }, [propItems]);

  useEffect(() => {
    onStepChange?.(currentIndex);
  }, [currentIndex]);

  const jump = (step: number) => {
    dispatch({ type: 'jump', step });
  };

  const next = () => {
    if (!isLastStep) {
      dispatch({ type: 'next' });
      setCanNext(defaultCanNextOnNewStep);
    } else onComplete?.();
  };

  const back = () => {
    dispatch({ type: 'back' });
    setCanNext(defaultCanNextOnNewStep);
  };

  return (
    <StepperProvider
      back={back}
      currentIndex={currentIndex}
      currentItem={currentItem}
      isCanNext={isCanNext}
      isDisable={isDisable}
      isFirstStep={isFirstStep}
      isLastStep={isLastStep}
      items={items}
      jump={jump}
      next={next}
      setCanNext={setCanNext}
      setDisable={setDisable}
    >
      {children}
    </StepperProvider>
  );
};

