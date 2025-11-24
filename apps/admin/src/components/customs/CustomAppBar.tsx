import { useEffect, useState } from 'react';
import { AppBarProps, useSidebarState, useLogout } from 'react-admin';
import { MenuIcon } from '@radix-ui/react-icons';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const APP_BAR_HEIGHT = 0;

const CustomAppBar = (_props: AppBarProps) => {
  const [, setSidebarOpen] = useSidebarState();

  useEffect(() => {
    // make sure the react-admin sidebar is open for desktop
    setSidebarOpen(true);
  }, [setSidebarOpen]);

  const [open, setOpen] = useState(false);
  const logout = useLogout();

  const navItems = [
    { label: 'All Warehouses', to: '/warehouse' },
    { label: 'Pending Requests', to: '/request' },
    { label: 'Revenue', to: '/revenue' },
    { label: 'Manage Users', to: '/users' },
  ];

  return (
    <>
      <TopBar>
        <MenuBtn onClick={() => setOpen((s) => !s)} aria-label="Open menu">
          <MenuIcon />
        </MenuBtn>
        <BrandTitle>iRent Admin</BrandTitle>
      </TopBar>

      {open ? (
        <Overlay role="dialog" aria-modal onClick={() => setOpen(false)}>
          <NavPanel onClick={(e) => e.stopPropagation()}>
            <HeaderMobile>
              <div>iRent Admin</div>
            </HeaderMobile>
            <Ul>
              {navItems.map((it) => (
                <li key={it.to}>
                  <NavLink to={it.to} onClick={() => setOpen(false)}>
                    {it.label}
                  </NavLink>
                </li>
              ))}
            </Ul>
            <FooterMobile>
              <button onClick={() => logout()}>Log out</button>
            </FooterMobile>
          </NavPanel>
        </Overlay>
      ) : null}
    </>
  );
};

export default CustomAppBar;

const TopBar = styled.header`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    position: sticky;
    top: 0;
    z-index: 1100;
    background: var(--admin-surface, #fff);
    border-bottom: 1px solid var(--admin-border-color);
  }
`;

const BrandTitle = styled.div`
  font-weight: 700;
  color: var(--admin-text-primary);
`;

const MenuBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 1200;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
`;

const NavPanel = styled.aside`
  width: min(320px, 70vw);
  background: var(--admin-surface, #fff);
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const HeaderMobile = styled.div`
  font-weight: 700;
  margin-bottom: 12px;
`;

const Ul = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  a {
    text-decoration: none;
    color: var(--admin-text-primary);
    padding: 10px 12px;
    border-radius: 8px;
    display: block;
  }
`;

const FooterMobile = styled.div`
  margin-top: auto;
  button {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    background: rgba(14, 165, 233, 0.08);
    border: 1px solid rgba(14, 165, 233, 0.2);
    cursor: pointer;
  }
` }** End Patch
