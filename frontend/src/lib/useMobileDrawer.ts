import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function useMobileDrawer() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Auto-close whenever the route changes (picking a nav item / certificate should dismiss the drawer).
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return { open, toggle: () => setOpen((v) => !v), close: () => setOpen(false) };
}
