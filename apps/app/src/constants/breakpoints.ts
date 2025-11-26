export const breakpoints = {
  xs: '480px', // phones
  sm: '640px', // small phones
  md: '768px', // tablets
  mdWide: '900px', // mid-size tablets / small laptops (fixes 800-1100 range)
  lg: '1100px', // large tablets / laptops
  xl: '1260px', // desktop
};

export const mq = {
  xs: `(max-width: ${breakpoints.xs})`,
  sm: `(max-width: ${breakpoints.sm})`,
  md: `(max-width: ${breakpoints.md})`,
  mdWide: `(max-width: ${breakpoints.mdWide})`,
  lg: `(max-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
};


