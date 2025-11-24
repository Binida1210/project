import styled from 'styled-components';
import { breakpoints } from '@/constants/breakpoints';

// Visual-only change: render brand text and color it purple. No behavior/logic changes.
export const Logo = () => {
  return (
    <Container aria-label="iRent logo">
      <Brand>iRent</Brand>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  font-family: 'Pacifico', cursive;
`;

const Brand = styled.span`
  /* use the font's default weight so the script logo looks lighter */
  font-weight: unset;
  color: #6b21a8; /* purple brand color */
  font-size: clamp(20px, 2.4vw, 36px);
  line-height: 1;
  letter-spacing: -0.5px;

  @media (min-width: ${breakpoints.lg}) {
    font-size: clamp(22px, 1.6vw, 34px);
  }
`;
