// Navigation header component with menu and authentication
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import { privateApi } from '@/axios/axios';
import { Button } from '@/components/Common/Button';
import { breakpoints } from '@/constants/breakpoints';

import { useAuthStore } from '../../../auth';
import { Logo } from '../Logo/Logo';

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0.9rem;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  position: relative; /* anchor for absolute-positioned mobile menu */
  /* keep header in normal flow - avoid absolute anchors which create layout surprises */

  @media (min-width: ${breakpoints.lg}) {
    padding: 0.65rem 2rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

const UlContainerRight = styled.ul`
  display: flex;
  gap: 0.5rem; /* reduce gap so small auth buttons fit better on narrow containers */
  list-style: none;
  margin: 0;

  @media (max-width: ${breakpoints.md}) {
    display: none; /* mobile uses the dropdown menu */
  }
`;

// We use the shared Button component for auth controls to keep visual consistency

// Plain, non-interactive greeting item
const GreetingText = styled.li`
  padding: 0.25rem 0.75rem;
  color: rgba(17, 24, 39, 0.85);
  font-weight: 600;
  cursor: default;
  user-select: none;

  /* Hide greeting on narrow/mobile viewports (<= 930px) per design request */
  @media (max-width: 930px) {
    display: none;
  }
  @media (max-width: ${breakpoints.lg}) {
    font-size: 0.95rem;
  }
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
  min-width: 120px;

  @media (max-width: ${breakpoints.md}) {
    /* remove forced min-width on small screens so layout doesn't reserve empty space */
    min-width: unset;
    padding-left: 0.25rem;
  }
`;

const CenterNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;

  @media (max-width: ${breakpoints.md}) {
    display: none; /* hide center links on small screens */
  }

  @media (min-width: ${breakpoints.lg}) {
    max-width: 640px;
    justify-content: center;
  }
`;

const UlContainerLeft = styled.ul`
  display: flex;
  gap: 1.25rem;
  list-style: none;
  margin: 0;

  li {
    font-weight: 500;
    color: #111827;
  }

  @media (max-width: ${breakpoints.lg}) {
    gap: 0.9rem;
  }

  @media (max-width: ${breakpoints.md}) {
    display: none; /* hide center links on mobile */
  }
`;

/* UserContainer removed: user actions are grouped with nav links for better UX */

const LeftSideItem = styled.li`
  padding: 0.35rem 0.6rem;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.12s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
  }

  @media (max-width: ${breakpoints.lg}) {
    font-size: 0.95rem;
  }
`;

const RightSide = styled.div`
  display: flex;
  align-items: center;
`;

const MenuButton = styled.button`
  display: none;
  background: transparent;
  border: 0;
  cursor: pointer;
  padding: 8px;

  @media (max-width: ${breakpoints.md}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled.div`
  display: none;
  /* Float the mobile menu as a right-aligned popup under the header for consistency. */
  position: absolute;
  top: calc(100% + 8px);
  right: 12px;
  z-index: 60;
  width: clamp(220px, 45vw, 320px);
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  padding: 8px 12px;

  &.open {
    display: block;
  }

  /* full-width on very small phones so it doesn't overflow the viewport */
  @media (max-width: 420px) {
    left: 8px;
    right: 8px;
    width: auto;
  }

  @media (min-width: ${breakpoints.lg}) {
    display: none;
  }
`;

const MobileList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 120px; /* reduce min-height so mobile menu doesn't leave large empty space */

  @media (max-width: ${breakpoints.sm}) {
    /* very small phones: collapse height further */
    min-height: 96px;
  }
`;

const MobileItem = styled.li`
  padding: 10px 12px;
  border-radius: 8px;

  /* if the item itself is hidden (e.g. greeting), remove its spacing as well */
  &.hidden {
    display: none;
    padding: 0;
    margin: 0;
    height: 0;
  }
`;

// A container to push items (logout) to the bottom of the menu
const MobileFooter = styled.li`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
`;

const MobileGreeting = styled.strong`
  display: block;
  @media (max-width: ${breakpoints.md}) {
    display: none;
  }
`;

// explicit helper: item that wraps the mobile greeting — hide the whole li on small screens
const MobileGreetingItem = styled(MobileItem)`
  @media (max-width: 930px) {
    display: none;
    padding: 0;
    margin: 0;
    height: 0;
  }
`;

/* small global rule to allow explicitly targeting header auth buttons */
const HeaderAuthStyles = createGlobalStyle`
  .irent-auth-btn-zero{
    padding: 0 1rem;
    min-width: unset !important;
  }
`;

// mobile-specific spacing is handled by the Button's 'fluid' size

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore(({ isAuthenticated, user, logout }) => ({
    isAuthenticated,
    user,
    logout,
  }));
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    privateApi.post('auth/revoke-token').catch(() => undefined);
    logout();
    navigate('/login');
  };

  // Close mobile menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const el = e.target as Node;
      if (menuOpen && !containerRef.current.contains(el)) setMenuOpen(false);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) setMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  return (
    <>
      {/* auth buttons global style */}
      <HeaderAuthStyles />
      <Container ref={containerRef}>
        {/* Left / Logo */}
        <LeftSide>
          <Link to={'/home'}>
            <Logo />
          </Link>
        </LeftSide>

        {/* Center nav - centered on wide screens, hidden on mobile via UlContainerLeft rules */}
        <CenterNav aria-label="Main navigation">
          <UlContainerLeft>
            <Link to={'/home'}>
              <LeftSideItem>Trang chủ</LeftSideItem>
            </Link>
            {/* 'Về chúng tôi' removed from navbar as per request */}
            {isAuthenticated && (
              <Link to={'/list'}>
                <LeftSideItem>Kho bãi</LeftSideItem>
              </Link>
            )}
            <Link to={'/help'}>
              <LeftSideItem>Hỗ trợ</LeftSideItem>
            </Link>
            <Link to={'/contact'}>
              <LeftSideItem>Liên hệ</LeftSideItem>
            </Link>
          </UlContainerLeft>
        </CenterNav>

        {/* Right / user actions */}
        <RightSide>
          <Nav>
            <MenuButton
              aria-label="Toggle menu"
              onClick={() => {
                setMenuOpen((s) => !s);
              }}
            >
              {/* simple accessible hamburger */}
              <svg
                aria-hidden
                fill="none"
                height="16"
                viewBox="0 0 22 16"
                width="22"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect fill="#111827" height="2" rx="1" width="22" />
                <rect fill="#111827" height="2" rx="1" width="22" y="7" />
                <rect fill="#111827" height="2" rx="1" width="22" y="14" />
              </svg>
            </MenuButton>
            <UlContainerRight>
              {isAuthenticated === undefined ? null : isAuthenticated === true ? (
                <>
                  <GreetingText aria-hidden>Hi, {user?.name}</GreetingText>
                  <li>
                    <Button
                      color="secondary"
                      size="sm"
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      Đăng xuất
                    </Button>
                  </li>
                </>
              ) : (
                <>
                  <li className="irent-w80-btn">
                    {/* explicitly zero padding here to override inherited padding for tight navbar */}
                    <Link to={'/sign-up'}>
                      <Button className="irent-auth-btn-zero" size="sm">
                        Đăng ký
                      </Button>
                    </Link>
                  </li>
                  <li className="irent-w80-btn">
                    {/* explicit padding reset so the two auth buttons do not overflow */}
                    <Link to={'/login'}>
                      <Button className="irent-auth-btn-zero" color="secondary" size="sm">
                        Đăng nhập
                      </Button>
                    </Link>
                  </li>
                </>
              )}
            </UlContainerRight>
          </Nav>

          {/* Mobile menu dropdown */}
          <MobileMenu aria-hidden={!menuOpen} className={menuOpen ? 'open' : ''} role="menu">
            <MobileList>
              <MobileItem>
                <Link to="/home" onClick={() => setMenuOpen(false)}>
                  Trang chủ
                </Link>
              </MobileItem>
              {/* About removed from mobile menu */}
              {isAuthenticated && (
                <>
                  <MobileGreetingItem>
                    <MobileGreeting>{`Hi, ${user?.name}`}</MobileGreeting>
                  </MobileGreetingItem>
                  <MobileItem>
                    <Link to="/list" onClick={() => setMenuOpen(false)}>
                      Kho bãi
                    </Link>
                  </MobileItem>
                  {/* logout moved to footer */}
                </>
              )}
              <MobileItem>
                <Link to="/help" onClick={() => setMenuOpen(false)}>
                  Hỗ trợ
                </Link>
              </MobileItem>
              <MobileItem>
                <Link to="/contact" onClick={() => setMenuOpen(false)}>
                  Liên hệ
                </Link>
              </MobileItem>

              {!isAuthenticated && (
                <>
                  <MobileItem>
                    <Link to="/sign-up" onClick={() => setMenuOpen(false)}>
                      <Button className="irent-auth-btn-zero" size="fluid">
                        Đăng ký
                      </Button>
                    </Link>
                  </MobileItem>
                  <MobileItem>
                    <Link to="/login" onClick={() => setMenuOpen(false)}>
                      <Button className="irent-auth-btn-zero" color="secondary" size="fluid">
                        Đăng nhập
                      </Button>
                    </Link>
                  </MobileItem>
                </>
              )}

              {isAuthenticated && (
                <MobileFooter>
                  <Button
                    color="primary"
                    size="fluid"
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    Đăng xuất
                  </Button>
                </MobileFooter>
              )}
            </MobileList>
          </MobileMenu>
        </RightSide>
      </Container>
    </>
  );
};
