import { useEffect } from 'react';
import { AppBarProps, useSidebarState } from 'react-admin';

export const APP_BAR_HEIGHT = 0;

const CustomAppBar = (_props: AppBarProps) => {
  const [, setSidebarOpen] = useSidebarState();

  useEffect(() => {
    setSidebarOpen(true);
  }, [setSidebarOpen]);

  return null;
};

export default CustomAppBar;
