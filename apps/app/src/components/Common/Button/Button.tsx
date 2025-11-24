import { blackA, red, redA, violetDark } from '@radix-ui/colors';
import * as stitches from '@stitches/react';

export type ButtonProps = stitches.ComponentProps<typeof StyledButton>;

export const Button = ({ color = 'primary', ...rest }: ButtonProps) => {
  return <StyledButton color={color} {...rest} />;
};

const StyledButton = stitches.styled('button', {
  all: 'unset',
  /* make default button a little less wide so it fits better in tight header spaces */
  minWidth: 120,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 12,
  padding: '0 18px',
  fontSize: 14,
  lineHeight: 1,
  fontWeight: 600,
  height: 38,
  backgroundColor: violetDark.violet10,
  color: 'white',
  boxShadow: `0 2px 6px ${blackA.blackA6}`,
  transition: 'background-color 0.25s ease, opacity 0.25s ease, box-shadow 0.25s ease',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  '&:hover:enabled': { backgroundColor: violetDark.violet9 },
  '&:active:enabled': { backgroundColor: violetDark.violet11 },
  '&:focus-visible': { outline: '2px solid ' + violetDark.violet9, outlineOffset: 2 },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  variants: {
    color: {
      secondary: {
        backgroundColor: '#ffffff',
        color: '#1e293b',
        boxShadow: `0 1px 3px ${blackA.blackA5}`,
        '&:hover:enabled': { backgroundColor: '#f1f5f9' },
        '&:active:enabled': { backgroundColor: '#e2e8f0' },
        '&:disabled': { backgroundColor: '#f8fafc' },
        border: '1px solid #cbd5e1',
      },
      danger: {
        backgroundColor: red.red9,
        '&:hover:enabled': { backgroundColor: red.red10 },
        '&:active:enabled': { backgroundColor: red.red11 },
        '&:disabled': { backgroundColor: redA.redA9 },
      },
      primary: {},
      ghost: {
        backgroundColor: 'transparent',
        color: violetDark.violet11,
        boxShadow: 'none',
        '&:hover:enabled': { backgroundColor: violetDark.violet4 },
        '&:active:enabled': { backgroundColor: violetDark.violet5 },
      },
    },
    size: {
      /* compact small variant — reduced minWidth and horizontal padding to avoid overflow when
         two small buttons are shown side-by-side (eg. Đăng ký + Đăng nhập in header menus) */
      sm: { height: 32, minWidth: 84, fontSize: 13, padding: '0 10px', borderRadius: 10 },
      md: {},
      lg: { height: 44, minWidth: 170, fontSize: 15, padding: '0 22px' },
      fluid: { width: '100%', minWidth: 'unset' },
    },
  },
  defaultVariants: { size: 'md' },
});
