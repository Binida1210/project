import styled from 'styled-components';

import { Option, Popover } from '../Common/Popover';

export type CardActions = {
  customHoverBackgroundColor?: string;
  title: string;
  onClick: () => void;
};

export type CardOptionsProps = {
  actions?: CardActions[];
  onClickThreeDots?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  open?: boolean;
  handleOpenChange?: (open: boolean) => void;
};

export const CardOptions = ({ actions, open, onClickThreeDots, handleOpenChange }: CardOptionsProps) => {
  const handleOptionsClick = (e: React.MouseEvent<HTMLButtonElement>, onClick: () => void) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <Popover
      align="center"
      content={
        <Container>
          {actions?.map((option) => (
            <Option
              key={option.title}
              customHoverBackgroundColor={option.customHoverBackgroundColor}
              title={option.title}
              onClick={(e) => handleOptionsClick(e, option.onClick)}
            />
          ))}
        </Container>
      }
      handleOpenChange={handleOpenChange}
      open={open}
      side="right"
      sideOffset={10}
    >
      {}
      <ClickArea></ClickArea>
    </Popover>
  );
};

const Container = styled.div`
  border-radius: 4px;
  background: white;

  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  width: 164px;
`;

const ClickArea = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
`;

const OptionButton = styled.div`
  padding: 3px;
  border-radius: 50%;
  top: 4.5px;
  right: 5px;
  display: flex;
  position: absolute;

  &:hover {
    background-color: #80808061;
  }
`;

