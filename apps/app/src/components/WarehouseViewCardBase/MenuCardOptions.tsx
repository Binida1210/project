import { useRef } from 'react';
import styled from 'styled-components';

import { ContextMenu, ContextMenuOptionType } from '../Common/ContextMenu';

export type MenuCardActions = {
  title: string;
  type?: ContextMenuOptionType;
  onClick?: () => void;
};

export type MenuCardOptionsProps = {
  actions?: MenuCardActions[];
};

export const MenuCardOptions = ({ actions }: MenuCardOptionsProps) => {
  return (
    <>
      <ContextMenu options={actions?.map((a) => ({ content: a.title, type: a.type, onClick: a.onClick }))}>
        <ClickArea />
      </ContextMenu>
    </>
  );
};

const ClickArea = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
  z-index: 2;
  @media (min-width: 1000px) and (max-width: 1250px) {
    display: none;
  }
`;
