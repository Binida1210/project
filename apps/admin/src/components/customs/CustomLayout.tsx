import { BarChartIcon, ClockIcon, CubeIcon, ExitIcon, PersonIcon, PlusIcon } from '@radix-ui/react-icons';
import React from 'react';
import { Layout, LayoutProps, useLogout } from 'react-admin';
import { NavLink, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import CustomAppBar from './CustomAppBar';

const SIDEBAR_WIDTH = 'min(320px, 20dvw)';

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
    --admin-radius-lg: 1rem; /* 16px */
    --admin-space-1: 0.5rem; /* 8px */
    --admin-space-2: 0.75rem; /* 12px */
    --admin-space-3: 1rem; /* 16px */
    --admin-space-4: 1.5rem; /* 24px */
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
    padding: clamp(1rem, 3vw, 2.5rem);
  }

  .RaLayout-content {
    max-width: calc(var(--admin-page-width, 1200px));
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
      padding: 1.25rem 1rem;
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
  padding: var(--admin-space-4) var(--admin-space-2);
  border-bottom: 1px solid rgba(203, 213, 225, 0.4);
  display: flex;
  align-items: center;
  gap: var(--admin-space-2);

  @media (max-width: 1100px) {
    /* tighten header spacing to avoid overflow on mid-width screens */
    padding: 0.875rem 0.75rem;
    gap: 0.5rem;
  }
`;

const Logo = styled.div`
  /* fluid logo size for admin: scales from mobile -> desktop */
  width: clamp(36px, 4.5vw, 48px);
  height: clamp(36px, 4.5vw, 48px);
  border-radius: clamp(8px, 1vw, 12px);
  background: var(--admin-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: clamp(13px, 1.2vw, 18px);
  letter-spacing: 0.02em;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  h1 {
    margin: 0;
    font-size: 0.9375rem; /* 15px */
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.01em;
  }

  span {
    font-size: 0.625rem; /* 10px */
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: var(--admin-space-3) var(--admin-space-2);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
  gap: 1.75rem;
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
  gap: 0.5rem;
`;

const NavItem = styled(NavLink)<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.75rem;
  border-radius: 0.625rem; /* 10px */
  text-decoration: none !important;
  color: ${(props) => (props.$primary ? '#ffffff' : '#1f2937')};
  background: ${(props) => (props.$primary ? 'var(--admin-primary)' : 'transparent')};
  border: 1px solid ${(props) => (props.$primary ? 'var(--admin-primary)' : 'transparent')};
  font-size: 0.8125rem; /* 13px */
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
    width: 1.125rem; /* 18px */
    height: 1.125rem;
    flex-shrink: 0;
  }

  /* reduce nav sizes on mid width screens to avoid overflow/wrapping */
  @media (max-width: 1100px) {
    padding: 0.625rem 0.6rem;
    gap: 0.625rem;
    font-size: 0.875rem;

    svg {
      width: 1rem;
      height: 1rem;
    }
    /* additional mid-range reduction (~1.5x smaller feel) for 769-1100 */
    @media (min-width: 769px) and (max-width: 1100px) {
      padding: calc(0.625rem / 1.5) calc(0.6rem / 1.5);
      gap: calc(0.625rem / 1.5);
      font-size: clamp(0.75rem, calc(0.875rem / 1.5), 0.875rem);

      svg {
        width: 0.875rem;
        height: 0.875rem;
      }
    }
  }
`;

const Footer = styled.div`
  padding: var(--admin-space-2);
  border-top: 1px solid rgba(203, 213, 225, 0.4);
`;

const LogoutBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.75rem 0.75rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(248, 113, 113, 0.4);
  background: rgba(248, 113, 113, 0.08);
  color: #b91c1c;
  font-size: 0.75rem;
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
    width: 1.0625rem; /* 17px */
    height: 1.0625rem;
  }
`;

const navItems = [
  {
    group: 'Nội dung',
    items: [{ label: 'Tất cả kho bãi', icon: <CubeIcon />, path: '/warehouse' }],
  },
  {
    group: 'Báo cáo',
    items: [
      { label: 'Đơn chờ duyệt', icon: <ClockIcon />, path: '/request' },
      { label: 'Thống kê doanh thu', icon: <BarChartIcon />, path: '/revenue' },
    ],
  },
  {
    group: 'Tài khoản',
    items: [{ label: 'Quản lý người dùng', icon: <PersonIcon />, path: '/users' }],
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
          Đăng xuất
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
