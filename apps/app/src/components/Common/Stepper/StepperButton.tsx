import { ReactNode } from 'react';

import { Button, ButtonProps } from '../Button/Button';
import { useStepperContext } from './context';
import { StepperActionType } from './models/stepper-item.model';

export type StepperButtonAction = {
  type: StepperActionType;
  payload?: unknown;
};

export type StepperButtonProps = Omit<ButtonProps, 'children' | 'onClick'> & {
  content?: ReactNode;
  onClick?: (currentStep: number | undefined) => void;
};

export type NextStepperButtonProps = StepperButtonProps & {
  finishContent?: ReactNode;
};

export const StepperNextButton = ({
  onClick,
  disabled,
  content: buttonContent = 'Tiếp theo',
  finishContent = 'Hoàn thành',
  ...otherProps
}: NextStepperButtonProps) => {
  const { next, isCanNext, isLastStep, currentIndex } = useStepperContext(StepperNextButton.name);
  const mergedDisabled = disabled === true ? true : disabled ?? !isCanNext;

  const handleNextClick = () => {
    onClick?.(currentIndex);
    next();
  };

  return (
    <Button
      css={{ minWidth: 120 }}
      disabled={mergedDisabled}
      onClick={handleNextClick}
      {...otherProps}
    >
      {isLastStep ? finishContent : buttonContent}
    </Button>
  );
};

export type BackStepperButtonProps = StepperButtonProps;

export const StepperBackButton = ({
  onClick,
  disabled,
  content: buttonContent = 'Quay lại',
  ...otherProps
}: StepperButtonProps) => {
  const { back, currentIndex, isFirstStep } = useStepperContext(StepperBackButton.name);
  const mergedDisabled = disabled === true ? true : disabled ?? isFirstStep;

  const handleNextClick = () => {
    onClick?.(currentIndex);
    back();
  };

  return (
    <Button css={{ minWidth: 120 }} disabled={mergedDisabled} onClick={handleNextClick} {...otherProps}>
      {buttonContent}
    </Button>
  );
};

