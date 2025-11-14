import { BarChartIcon, ClockIcon, CubeIcon, ExitIcon, PersonIcon, PlusIcon } from '@radix-ui/react-icons';
import React from 'react';
import { Layout, LayoutProps, useLogout } from 'react-admin';
import { NavLink, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import CustomAppBar from './CustomAppBar';

const SIDEBAR_WIDTH = '20dvw';

const GlobalStyle = createGlobalStyle`
  :root {
    --admin-primary: #0ea5e9;
    --admin-primary-dark: #0284c7;
    --admin-primary-light: #38bdf8;
    --admin-secondary: #2563eb;
    --admin-page-bg: #f8fafc;
    --admin-surface: #ffffff;
    --admin-surface-muted: #f1f5f9;
    --admin-border-color: rgba(203, 213, 225, 0.6);
    --admin-text-primary: #0f172a;
    --admin-text-secondary: #64748b;
    --admin-text-tertiary: #94a3b8;
    --admin-radius-lg: 16px;
    --admin-shadow-soft: 0 2px 12px rgba(15, 23, 42, 0.08);
  }

  body {
    background: var(--admin-page-bg);
  }

  .RaSidebar-root {
    display: none !important;
  }

  .RaLayout-appFrame {
    min-height: 100dvh;
  }

  .RaLayout-contentWithSidebar {
    margin-left: ${SIDEBAR_WIDTH};
    padding: clamp(24px, 3vw, 40px);
  }

  .RaLayout-content {
    max-width: 1200px;
    margin: 0 auto;

    /* Style all h1 in content area */
    h1 {
      color: var(--admin-primary) !important;
      font-weight: 700;
    }

    /* Style React Admin buttons */
    .MuiButton-root:not([color="error"]) {
      background: var(--admin-primary) !important;
      color: #ffffff !important;
      border: 1px solid var(--admin-primary) !important;
      font-weight: 600 !important;
      transition: background 220ms ease !important;
      text-transform: none !important;

      &:hover {
        background: var(--admin-primary-dark) !important;
      }
    }

    /* Keep error buttons red */
    .MuiButton-root[color="error"] {
      background: rgba(239, 68, 68, 0.1) !important;
      color: #dc2626 !important;
      border: 1px solid rgba(239, 68, 68, 0.3) !important;
      transition: background 220ms ease !important;

      &:hover {
        background: rgba(239, 68, 68, 0.2) !important;
      }
    }

    /* Style DataGrid header */
    .RaDatagrid-headerCell {
      background: rgba(14, 165, 233, 0.08) !important;
      font-weight: 700 !important;
      color: var(--admin-primary) !important;
      border-bottom: 2px solid var(--admin-primary) !important;
    }

    /* Style active/selected rows */
    .RaDatagrid-rowCell {
      border-bottom-color: rgba(14, 165, 233, 0.15) !important;
    }

    /* Style checkboxes */
    .MuiCheckbox-root.Mui-checked {
      color: var(--admin-primary) !important;
    }
  }

  .RaAppBar-root {
    display: none !important;
  }

  @media (max-width: 768px) {
    .RaLayout-contentWithSidebar {
      margin-left: 0;
      padding: 20px 16px;
    }
  }
`;

const Sidebar = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: ${SIDEBAR_WIDTH};
  height: 100dvh;
  background: #ffffff;
  border-right: 1px solid rgba(203, 213, 225, 0.6);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  box-sizing: border-box;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Header = styled.div`
  padding: 24px 20px;
  border-bottom: 1px solid rgba(203, 213, 225, 0.4);
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Logo = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: var(--admin-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.02em;
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  h1 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.01em;
  }

  span {
    font-size: 10px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: 24px 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const NavGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const GroupTitle = styled.h2`
  margin: 0;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #94a3b8;
  padding: 0 12px;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const NavItem = styled(NavLink)<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: 10px;
  text-decoration: none !important;
  color: ${(props) => (props.$primary ? '#ffffff' : '#1f2937')};
  background: ${(props) => (props.$primary ? 'var(--admin-primary)' : 'transparent')};
  border: 1px solid ${(props) => (props.$primary ? 'var(--admin-primary)' : 'transparent')};
  font-size: 13px;
  font-weight: 500;
  transition:
    background 220ms ease,
    border-color 220ms ease,
    color 220ms ease;

  &.active {
    background: ${(props) => (props.$primary ? 'var(--admin-primary)' : 'rgba(14, 165, 233, 0.1)')};
    border-color: ${(props) => (props.$primary ? 'var(--admin-primary)' : 'rgba(14, 165, 233, 0.35)')};
    color: ${(props) => (props.$primary ? '#ffffff' : '#0ea5e9')};
  }

  &:hover {
    background: ${(props) => (props.$primary ? 'var(--admin-primary-dark)' : 'rgba(14, 165, 233, 0.12)')};
    border-color: ${(props) => (props.$primary ? 'var(--admin-primary-dark)' : 'rgba(14, 165, 233, 0.4)')};
    text-decoration: none !important;
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`;

const Footer = styled.div`
  padding: 16px;
  border-top: 1px solid rgba(203, 213, 225, 0.4);
`;

const LogoutBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 11px 12px;
  border-radius: 10px;
  border: 1px solid rgba(248, 113, 113, 0.4);
  background: rgba(248, 113, 113, 0.08);
  color: #b91c1c;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 220ms ease,
    border-color 220ms ease;

  &:hover {
    background: rgba(248, 113, 113, 0.16);
    border-color: rgba(248, 113, 113, 0.6);
  }

  svg {
    width: 17px;
    height: 17px;
  }
`;

const navItems = [
  {
    group: 'Content',
    items: [{ label: 'All Warehouses', icon: <CubeIcon />, path: '/warehouse' }],
  },
  {
    group: 'Reports',
    items: [
      { label: 'Pending Requests', icon: <ClockIcon />, path: '/request' },
      { label: 'Revenue Statistics', icon: <BarChartIcon />, path: '/revenue' },
    ],
  },
  {
    group: 'Accounts',
    items: [{ label: 'User Management', icon: <PersonIcon />, path: '/users' }],
  },
];

const CustomSidebar = () => {
  const logout = useLogout();

  return (
    <Sidebar>
      <Header>
        <Logo>IR</Logo>
        <Brand>
          <h1>iRent Admin</h1>
          <span>Dashboard</span>
        </Brand>
      </Header>

      <Nav>
        {navItems.map((section) => (
          <NavGroup key={section.group}>
            <GroupTitle>{section.group}</GroupTitle>
            <NavList>
              {section.items.map((item) => (
                <li key={item.path}>
                  <NavItem $primary={item.primary} to={item.path}>
                    {item.icon}
                    {item.label}
                  </NavItem>
                </li>
              ))}
            </NavList>
          </NavGroup>
        ))}
      </Nav>

      <Footer>
        <LogoutBtn onClick={() => logout()}>
          <ExitIcon />
          Logout
        </LogoutBtn>
      </Footer>
    </Sidebar>
  );
};

const EmptyComponent = () => null;

export const CustomLayout = (props: LayoutProps) => (
  <>
    <GlobalStyle />
    <CustomSidebar />
    <Layout {...props} appBar={CustomAppBar} menu={EmptyComponent} sidebar={EmptyComponent} />
  </>
);
